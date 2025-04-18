declare module "colorthief" {
  export default class ColorThief {
    getPalette(
      img: HTMLImageElement,
      colorCount: number
    ): [number, number, number][];
    getColor(img: HTMLImageElement): [number, number, number];
  }
}
