import { Component, h, State, Prop } from '@stencil/core';

@Component({
  tag: 'camera-preview',
  styleUrl: 'camera-preview.css',
  shadow: true,
})
export class CameraPreview {
  container!: HTMLElement;
  localStream!: MediaStream;
  cameraSelect!: HTMLSelectElement;
  camera!: HTMLVideoElement;
  interval:any;
  decoding:boolean = false;
  @State() viewBox: string = "0 0 1920 1080";
  @Prop() license?: string;
  @Prop() drawOverlay?: boolean;

  async connectedCallback() {
    console.log("connected");
  }

  componentDidLoad(){
    this.loadDevicesAndPlay();
  }

  disconnectedCallback() {
    console.log("dis connected");
  }

  onCameraChanged(){
    var deviceId = this.cameraSelect.selectedOptions[0].value;
    this.play(deviceId);
  }

  onCameraOpened() {
    console.log("on opened");
    this.updateViewBox();
  }

  updateViewBox(){
    this.viewBox = "0 0 "+this.camera.videoWidth+" "+this.camera.videoHeight;
  }

  loadDevicesAndPlay(){
    console.log(this.cameraSelect);
    console.log(this.camera);
    var constraints = {video: true, audio: false};
    navigator.mediaDevices.getUserMedia(constraints).then(async stream => {
      this.localStream = stream;
      this.cameraSelect.innerHTML="";
      const devices = await navigator.mediaDevices.enumerateDevices();
      var count = 0;
      var cameraDevices = [];
      var defaultIndex = 0;
      for (var i=0;i<devices.length;i++){
          var device = devices[i];
          if (device.kind == 'videoinput'){
              cameraDevices.push(device);
              var label = device.label || `Camera ${count++}`;
              console.log(this.cameraSelect);
              console.log(label);
              this.cameraSelect.add(new Option(label,device.deviceId));
              if (label.toLowerCase().indexOf("back") != -1) { //select the back camera as the default
                defaultIndex = cameraDevices.length - 1;
              }
              if (label.toLowerCase().indexOf("founder") != -1) { //test desktop camera
                defaultIndex = cameraDevices.length - 1;
              }
          }
      }

      if (cameraDevices.length>0) {
        this.cameraSelect.selectedIndex = defaultIndex;
        this.play(cameraDevices[defaultIndex].deviceId);
      }else{
        alert("No camera detected.");
      }
    });
  }
  
  play(deviceId:string) {
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
  };

  render() {
    return (
      <div class="camera-container" ref={(el) => this.container = el}>
        <select onChange={() => this.onCameraChanged()}  id="camera-sel" ref={(el) => this.cameraSelect = el as HTMLSelectElement}></select>
        <button onClick={() => this.close()} id="close-btn">Close</button>
        <video class="camera fullscreen" ref={(el) => this.camera = el as HTMLVideoElement} onLoadedData={()=>this.onCameraOpened()} muted autoplay="autoplay" playsinline="playsinline" webkit-playsinline></video>
      </div>
    );
  }
}
