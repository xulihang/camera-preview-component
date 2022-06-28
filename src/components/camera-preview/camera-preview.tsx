import { Component, h, State, Prop, Method } from '@stencil/core';
import { AnalysingResult, Resolution } from '../../definitions';

@Component({
  tag: 'camera-preview',
  styleUrl: 'camera-preview.css',
  shadow: true,
})
export class CameraPreview {
  container!: HTMLElement;
  localStream!: MediaStream;
  camera!: HTMLVideoElement;
  devices!: MediaDeviceInfo[];
  @State() viewBox: string = "0 0 1920 1080";
  @State() analysingResults: AnalysingResult[];
  @Prop() license?: string;
  @Prop() drawOverlay?: boolean;
  @Prop() desiredResolution?: Resolution;
  @Prop() desiredCamera?: string;
  @Prop() onOpened?: () => void;
  @Prop() onClosed?: () => void;
  
  @Method()
  async updateAnalysingResults(results:AnalysingResult[]) {
    this.analysingResults = results;
  }

  @Method()
  async getVideoElement() {
    return this.camera;
  }

  @Method()
  async getCameras() {
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

  componentDidLoad(){
    this.playWithDesired();
  }

  disconnectedCallback() {
    console.log("dis connected");
  }

  onCameraOpened() {
    console.log("on opened");
    if (this.onOpened) {
      this.onOpened();
    }
    this.updateViewBox();
  }

  updateViewBox(){
    this.viewBox = "0 0 "+this.camera.videoWidth+" "+this.camera.videoHeight;
  }

  async loadDevices(){
    var constraints = {video: true, audio: false};
    await navigator.mediaDevices.getUserMedia(constraints)
    this.devices = await navigator.mediaDevices.enumerateDevices();
  }

  getDesiredDevice(devices:MediaDeviceInfo[]){
    var count = 0;
    var cameraDevices:MediaDeviceInfo[] = [];
    var desiredIndex = 0;
    for (var i=0;i<devices.length;i++){
      var device = devices[i];
      if (device.kind == 'videoinput'){
        cameraDevices.push(device);
        var label = device.label || `Camera ${count++}`;
        if (this.desiredCamera) {
          console.log("desired camera:"+this.desiredCamera);
          if (label.toLowerCase().indexOf(this.desiredCamera.toLowerCase()) != -1) {
            desiredIndex = cameraDevices.length - 1;
            break;
          } 
        }
      }
    }

    if (cameraDevices.length>0) {
      return cameraDevices[desiredIndex].deviceId;
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
      if (this.desiredResolution) {
        this.play(desiredDevice,this.desiredResolution);
      }else{
        this.play(desiredDevice);
      }
    }else{
      throw new Error("No camera detected");
    }
  }

  play(deviceId:string,desiredResolution?:Resolution) {
    console.log("using device id: "+deviceId);
    stop(); // close before play
    var constraints = {};
  
    if (!!deviceId){
      constraints = {
        video: {deviceId: deviceId},
        audio: false
      }
    }else{
      constraints = {
        video: true,
        audio: false
      }
    }

    if (desiredResolution) {
      constraints["video"]["width"] = desiredResolution.width;
      constraints["video"]["height"] = desiredResolution.height;
    }
    

    let pThis = this;
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      pThis.localStream = stream;
      // Attach local stream to video element      
      pThis.camera.srcObject = stream;
    }).catch(function(err) {
      console.error('getUserMediaError', err, err.stack);
      alert(err.message);
    });
  }
  
  stop () {
    try{
      if (this.localStream){
        this.localStream.getTracks().forEach(track => track.stop());
      }
    } catch (e){
      alert(e.message);
    }
  };

  close () {
    this.stop();
    this.container.style.display = "none";
    if (this.onClosed) {
      this.onClosed();
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
        viewBox={this.viewBox}
        xmlns="<http://www.w3.org/2000/svg>"
        class="overlay fullscreen">
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
      <div class="camera-container" ref={(el) => this.container = el}>
        {this.renderSVGOverlay()}
        <slot/>
        <video class="camera fullscreen" ref={(el) => this.camera = el as HTMLVideoElement} onLoadedData={()=>this.onCameraOpened()} muted autoplay="autoplay" playsinline="playsinline" webkit-playsinline></video>
      </div>
    );
  }
}
