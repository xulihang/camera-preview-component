import { Component, h, State, Prop, Method, Watch, Event, EventEmitter } from '@stencil/core';
import { AnalysingResult, Resolution } from '../../definitions';

interface Options {
  deviceId?:string;
  facingMode?:string;
  desiredResolution?:Resolution;
}

@Component({
  tag: 'camera-preview',
  styleUrl: 'camera-preview.css',
  shadow: true,
})
export class CameraPreview {
  localStream!: MediaStream;
  camera!: HTMLVideoElement;
  devices!: MediaDeviceInfo[];
  @State() viewBox: string = "0 0 1920 1080";
  @State() analysingResults: AnalysingResult[];
  @Prop() drawOverlay?: boolean;
  @Prop() desiredResolution?: Resolution;
  @Prop() desiredCamera?: string;
  @Prop() facingMode?: string;
  @Prop() active?: boolean;
  @Event() opened?: EventEmitter<void>;
  @Event() closed?: EventEmitter<void>;
  
  @Method()
  async updateAnalysingResults(results:AnalysingResult[]) {
    this.analysingResults = results;
  }

  @Method()
  async getVideoElement() {
    return this.camera;
  }

  @Method()
  async getAllCameras() {
    if (this.devices) {
      return this.devices;
    }else{
      await this.loadDevices();
      return this.devices;
    }
  }

  async connectedCallback() {
    console.log("connected");
  }

  @Watch('active')
  watchPropHandler(newValue: boolean) {
    if (newValue === true) {
      this.playWithDesired();
    }else{
      this.stop();
    }
  }

  componentDidLoad(){
    if (this.active != false) {
      this.playWithDesired();
    }
  }

  disconnectedCallback() {
    this.stop();
  }

  onCameraOpened() {
    if (this.opened) {
      this.opened.emit();
    }
    this.updateViewBox();
  }

  updateViewBox(){
    this.viewBox = "0 0 "+this.camera.videoWidth+" "+this.camera.videoHeight;
  }

  async loadDevices(){
    const constraints = {video: true, audio: false};
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const devices = await navigator.mediaDevices.enumerateDevices();
    var cameraDevices:MediaDeviceInfo[] = [];
    for (var i=0;i<devices.length;i++){
      var device = devices[i];
      if (device.kind == 'videoinput'){ // filter out audio devices
        cameraDevices.push(device);
      }
    }
    this.devices = cameraDevices;

    const tracks = stream.getTracks();
    for (let i=0;i<tracks.length;i++) {
      const track = tracks[i];
      track.stop();
    }
  }

  getDesiredDevice(devices:MediaDeviceInfo[]){
    var count = 0;
    var desiredIndex = 0;
    for (var i=0;i<devices.length;i++){
      var device = devices[i];
      var label = device.label || `Camera ${count++}`;
      if (this.desiredCamera) {
        if (label.toLowerCase().indexOf(this.desiredCamera.toLowerCase()) != -1) {
          desiredIndex = i;
          break;
        } 
      }
    }

    if (devices.length>0) {
      return devices[desiredIndex].deviceId;
    }else{
      return null;
    }
  }
  
  async playWithDesired(){
    if (!this.devices) {
      await this.loadDevices();
    }
    let desiredDevice:string|null = this.getDesiredDevice(this.devices)
    if (desiredDevice) {
      let options:Options = {};
      options.deviceId = desiredDevice;
      if (this.desiredResolution) {
        options.desiredResolution = this.desiredResolution;
      }
      if (this.facingMode) {
        options.facingMode = this.facingMode;
      }
      this.play(options);
    }else{
      throw new Error("No camera detected");
    }
  }

  play(options:Options) {
    this.stop(); // close before play
    var constraints = {};
  
    if (options.deviceId){
      constraints = {
        video: {deviceId: options.deviceId},
        audio: false
      }
    }else{
      constraints = {
        video: true,
        audio: false
      }
    }

    if (options.facingMode) {
      delete constraints["video"]["deviceId"];
      constraints["video"]["facingMode"] = { exact: options.facingMode };
    }

    if (options.desiredResolution) {
      constraints["video"]["width"] = options.desiredResolution.width;
      constraints["video"]["height"] = options.desiredResolution.height;
    }
    

    let pThis = this;
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      pThis.localStream = stream;
      // Attach local stream to video element      
      pThis.camera.srcObject = stream;
    }).catch(function(err) {
      if (options.facingMode) { // facing mode not supported on desktop Chrome
        delete options["facingMode"];
        pThis.play(options);
      }else{
        console.error('getUserMediaError', err, err.stack);
      }
    });
  }
  
  stop () {
    try{
      if (this.localStream){
        const tracks = this.localStream.getTracks();
        for (let i=0;i<tracks.length;i++) {
          const track = tracks[i];
          track.stop();
        }
        if (this.closed) {
          this.closed.emit();
        }
      }
    } catch (e){
      alert(e.message);
    }
  };

  getPointsData = (result:AnalysingResult) => {
    let pointsData = "";
    for (let index = 0; index < result.localizationResult.length; index++) {
      const point = result.localizationResult[index];
      pointsData = pointsData + point.x + "," + point.y + " "
    }
    pointsData = pointsData.trim();
    return pointsData;
  }

  renderSVGOverlay(){
    if (this.drawOverlay === true && this.analysingResults) {
      return (
        <svg 
        preserveAspectRatio="xMidYMid slice"
        viewBox={this.viewBox}
        xmlns="<http://www.w3.org/2000/svg>"
        class="overlay full">
        {this.analysingResults.map((result,idx) => (
          <polygon key={"poly-"+idx} xmlns="<http://www.w3.org/2000/svg>"
          points={this.getPointsData(result)}
          class="polygon"
          />
        ))}
        {this.analysingResults.map((result,idx) => (
          <text key={"text-"+idx} xmlns="<http://www.w3.org/2000/svg>"
          x={result.localizationResult[0].x}
          y={result.localizationResult[0].y}
          fill="red"
          font-size="20"
          >{result.text}</text>
        ))}
      </svg>
      )
    }
  }

  render() {
    return (
      <div class="camera-container full">
        <video class="camera full" ref={(el) => this.camera = el as HTMLVideoElement} onLoadedData={()=>this.onCameraOpened()} muted autoplay="autoplay" playsinline="playsinline" webkit-playsinline></video>
        {this.renderSVGOverlay()}
        <slot/>
      </div>
    );
  }
}
