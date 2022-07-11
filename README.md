![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)


## Camera Preview Web Component

This component opens the camera using `getUserMedia`. We can use third-party libraries to add extra frame analysing functions like barcode scanning to it.

[Online demo which scans barcodes](https://singular-madeleine-557145.netlify.app/) using [Dynamsoft Barcode Reader](https://www.dynamsoft.com/barcode-reader/overview/).

### Usage

In your HTML, add the component:

```html
<camera-preview></camera-preview>
```

You can define the props and events like this:

```js
const cameraElement = document.querySelector('camera-preview');
const onOpened = () => {
  console.log("opened");
}
const onClosed = () => {
  console.log("closed");
}
cameraElement.addEventListener("opened",onOpened);
cameraElement.addEventListener("closed",onClosed);
cameraElement.drawOverlay = true;
cameraElement.desiredCamera = "founder";
cameraElement.facingMode = "environment";
cameraElement.active = true;
cameraElement.desiredResolution = {width:1280,height:720};
```

You can get the inner `video` element using this method:

```js
const video = await cameraElement.getVideoElement();
```

You can learn more about the usage by checking out the [demos](https://github.com/xulihang/camera-preview-demo).


## Install this component

### Script tag

- Put a script tag similar to this 

   ```html
   <script type="module">
     import { defineCustomElements } from 'https://cdn.jsdelivr.net/npm/camera-preview-component/dist/esm/loader.js';
     defineCustomElements();
   </script>
   ```
   
   in the head of your index.html
   
- Then you can use the element anywhere in your template, JSX, html etc

### Node Modules
- Run `npm install camera-preview-component --save`
- Put a script tag similar to this 

   ```html
   <script type="module">
     import { defineCustomElements } from 'node_modules/camera-preview-component/dist/esm/loader.js';
     defineCustomElements();
   </script>
   ```
   
   in the head of your index.html
   
- Then you can use the element anywhere in your template, JSX, html etc

### In a stencil-starter app
- Run `npm install camera-preview-component --save`
- Add an import to the npm packages `import camera-preview-component;`
- Then you can use the element anywhere in your template, JSX, html etc

## FAQ

How to specify which camera to use?

1. Use the `desiredCamera` prop. If one of the camera's name contains it, then it will be used. You can get the devices list using the `getAllCameras` method.
2. Use the `facingMode` prop. Set it to `environment` to use the back camera. Set it to `user` to use the front camera. Please note that this is not supported on Desktop.

You can use the two props together.



