type Context = CanvasRenderingContext2D;

export function drawImage(context: Context, image: HTMLImageElement) {
  const w = image.width;
  const h = image.height;
  context.drawImage(image, 0, 0, w, h, 175, 50, 250, 250);
}

export function drawTitles(context: Context, title: string, series: string) {
  context.font = "1.7rem sans-serif";
  context.textAlign = "center";
  context.fillStyle = "#dfdfdf";
  context.fillText(title, 300, 385);
  context.font = "1.2rem sans-serif";
  context.textAlign = "center";
  context.fillStyle = "##f0f0f0";
  context.fillText(series, 300, 410);
}

export function drawProgressBar(context: Context, progress: number = 0) {
  const y = 485;
  const xv = 300;
  const xo = 250;
  const [xa, xb] = [xv - xo, xv + xo];
  const progressOffset = xo * 2 * progress;

  context.beginPath();
  context.moveTo(xa, y);
  context.strokeStyle = "#fff";
  context.lineWidth = 15;
  context.lineCap = "round";
  context.lineTo(xb, y);
  context.stroke();

  context.beginPath();
  context.moveTo(xa, y);
  context.strokeStyle = "#5f69c2";
  context.lineWidth = 15;
  context.lineCap = "round";
  context.lineTo(xa + progressOffset, y);
  context.stroke();
}

export function drawCurrentTime(context: Context, value: string) {
  context.font = "bold 1rem monospace";
  context.fillStyle = "#dfdfdf";
  context.fillText(value, 300 - 235, 520);
}

export function drawRemainingTime(context: Context, value: string) {
  context.font = "bold 1rem monospace";
  context.fillStyle = "#dfdfdf";
  context.fillText(value, 300 + 220, 520);
}

export function clearCanvas(context: Context) {
  context.clearRect(0, 0, 600, 600);
}

export function drawBackground(canvas: HTMLCanvasElement, context: Context) {
  context.fillStyle = "#343434";
  context.fillRect(0, 0, canvas.width, canvas.height);
}
