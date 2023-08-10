import fse from "fs-extra";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";
import imageminWebp from "imagemin-webp";
import imageminGifsicle from "imagemin-gifsicle";
import sharp from "sharp";
import chalk from "chalk";

let inputFolder = "entrada";
let outputFolder = "opt";
let targetWidth = 1920;

const processImage = async () => {
  try {
    const files = await fse.readdir(inputFolder);
    await fse.emptyDir(outputFolder);
    for (const file of files) {
      if (
        file.includes(".jpg") ||
        file.includes(".png") ||
        file.includes(".svg") ||
        file.includes(".webp") ||
        file.includes(".gif")
      ) {
        let inputPath = `${inputFolder}/${file}`;

        let outputPath = `${outputFolder}/${file}`;

        await sharp(inputPath).resize(targetWidth).toFile(outputPath);

        await imagemin([outputPath], {
          destination: outputFolder,
          plugins: [
            imageminJpegtran({ quality: 80 }), // Optimiza JPG (calidad 80)
            imageminPngquant(), // Optimiza PNG
            imageminSvgo(), // Optimiza SVG
            imageminWebp({ quality: 80 }), // Optimiza WebP
            imageminGifsicle(), // Optimiza GIF
          ],
        });
        console.log(chalk.blue(`Imagen ${file} optimizada correctamente`));
      }
    }
    console.log(
      chalk.green.bold(`Todas las imagenes se han optimizado correctamente`)
    );
  } catch (err) {
    console.log(err);
  }
};

processImage();
