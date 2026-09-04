export function comprimirImagem(file: File, tamanhoMax = 320, qualidade = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > height && width > tamanhoMax) {
          height = Math.round((height * tamanhoMax) / width);
          width = tamanhoMax;
        } else if (height > tamanhoMax) {
          width = Math.round((width * tamanhoMax) / height);
          height = tamanhoMax;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Não foi possível processar a imagem."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", qualidade));
      };

      img.onerror = () => reject(new Error("Não foi possível ler a imagem."));
      img.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.readAsDataURL(file);
  });
}
