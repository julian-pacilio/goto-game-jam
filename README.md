## goto-gam-jam 
 
goto-gam-jam es un proyecto desarrollado en Node.js y MongoDB para una plataforma de competencia de desarrollo de videojuegos. 
Este README proporciona información sobre cómo configurar y ejecutar el proyecto
 
### Requisitos previos 
- Node.js instalado en tu máquina 
- MongoDB instalado y en ejecución 
 
### Configuración 
 
1. Clona el repositorio de goto-gam-jam en tu máquina local.
    git clone https://github.com/julian-pacilio/goto-game-jam.git

2. Navega al directorio del proyecto.
    cd goto-gam-jam
   
4. Instala las dependencias del proyecto.
    npm install

5. Configura la conexión a la base de datos MongoDB. 
   - Abre el archivo  mongo.js  en la carpeta  services. 
   - Reemplaza la URL de conexión de MongoDB con tu propia URL de conexión.
   - Crea una nueva DB con el nombre goto_gam_jam, que contenga 3 collections => games, games_votes, judges
   - Puedes importar la data a las collections correspondientes, utilizando los .json almacenados en la carpeta data
 
### Ejecución 
 
Una vez que hayas configurado el proyecto, puedes ejecutarlo utilizando el siguiente comando:
    npm run dev

Esto iniciará el servidor y podrás acceder a la plataforma de competencia de desarrollo de videojuegos en tu navegador. 
 
