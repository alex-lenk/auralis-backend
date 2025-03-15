const fs = require('fs').promises;
const path = require('path');

const folderPath = path.resolve('./audio/spatial_orbit/');
const prefixRename = '_10';

async function renameFiles() {
  try {
    const files = await fs.readdir(folderPath);

    for (const file of files) {
      const oldPath = path.join(folderPath, file);

      // Проверяем, содержит ли имя файла prefixRename
      if (file.includes(prefixRename)) {
        const newFileName = file.replace(prefixRename, '');
        const newPath = path.join(folderPath, newFileName);

        await fs.rename(oldPath, newPath);
        console.log(`✅ ${file} → ${newFileName}`);
      }
    }

    console.log('🎉 Переименование завершено.');
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

renameFiles();
