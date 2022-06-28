export interface AnalysingResult{
  localizationResult:Point2D[];
  text:string;
  rawData?:any;
}

export interface BarcodeResult extends AnalysingResult {
  barcodeText: string;
  barcodeFormat: string;
}

export interface Point2D{
  x:number;
  y:number;
}