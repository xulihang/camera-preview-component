# camera-preview



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute        | Description | Type         | Default     |
| ------------------- | ---------------- | ----------- | ------------ | ----------- |
| `active`            | `active`         |             | `boolean`    | `undefined` |
| `desiredCamera`     | `desired-camera` |             | `string`     | `undefined` |
| `desiredResolution` | --               |             | `Resolution` | `undefined` |
| `drawOverlay`       | `draw-overlay`   |             | `boolean`    | `undefined` |
| `facingMode`        | `facing-mode`    |             | `string`     | `undefined` |


## Events

| Event    | Description | Type                |
| -------- | ----------- | ------------------- |
| `closed` |             | `CustomEvent<void>` |
| `opened` |             | `CustomEvent<void>` |


## Methods

### `getAllCameras() => Promise<MediaDeviceInfo[]>`



#### Returns

Type: `Promise<MediaDeviceInfo[]>`



### `getVideoElement() => Promise<HTMLVideoElement>`



#### Returns

Type: `Promise<HTMLVideoElement>`



### `takePhoto(tryImageCapture?: boolean) => Promise<Blob>`



#### Returns

Type: `Promise<Blob>`



### `updateAnalysingResults(results: AnalysingResult[]) => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
