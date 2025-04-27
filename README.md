# BNYHAVN - Airbnb Replica

## Project Description
BNYHAVN is a full-stack application designed to replicate the core functionalities of Airbnb. It enables users to create and manage their own listings, submit reviews on properties, and securely manage their accounts. The application also incorporates robust authentication and authorization mechanisms, while seamlessly integrating cloud storage for media management.

## Key Features:
- User registration and authentication, authorization
- Property listings with image uploads using Cloudinary
- Searching and filtering options for properties
- Responsive design for a seamless experience on desktop and mobile
- 
## Technologies Used:
- **Frontend:** HTML, CSS, Bootstrap, JavaScript, EJS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Cloud Storage:** Cloudinary
- **Authentication:** Passport.js
- **Version Control:** Git & GitHub
- 
## Packages Installed

- **cloudinary**  
  (Used for seamless integration of cloud storage and media management, enabling image and file uploads)
  
- **connect-flash**  
  (Provides flash messages for user notifications, enhancing the user experience)
  
- **connect-mongo**  
  (Enables session storage in MongoDB, making it easier to manage user sessions in a scalable way)
  
- **dotenv**  
  (Used to manage environment variables securely, keeping sensitive data such as API keys and credentials out of the codebase)
  
- **ejs**  
  (Embedded JavaScript templating engine, used for rendering dynamic views on the frontend)
  
- **ejs-mate**  
  (Enhances EJS templating by offering additional features and layout support)
  
- **express**  
  (The core web framework used to build the server and handle routes, requests, and responses)
  
- **express-session**  
  (Manages user sessions on the server to maintain state across multiple requests)
  
- **joi**  
  (A validation library used to validate user input and data models to ensure correctness)
  
- **method-override**  
  (Allows you to override HTTP methods like PUT and DELETE, which is helpful in RESTful APIs)
  
- **mongoose**  
  (MongoDB object modeling tool that provides a schema-based solution for modeling data)
  
- **multer**  
  (A middleware for handling file uploads in Node.js, specifically used for image uploads in this project)
  
- **passport**  
  (Authentication middleware used to handle user login and sessions)
  
- **passport-local**  
  (A Passport strategy for local authentication, using a username and password for user login)
  
- **passport-local-mongoose**  
  (A Mongoose plugin that simplifies the integration of Passport with MongoDB)
  
- **multer-storage-cloudinary**  
  (A storage engine for Multer that allows direct integration with Cloudinary for image storage)

## Development Process

### Initial Setup
1. **Cloning the Repository:**
   - I started by cloning the repository from GitHub to my local machine:
     ```
     git clone https://github.com/Tejas-Tupe/BNYHAVN-Airbnb-Replica
     ```

2. **Dependencies Installation:**
   - I used `npm` to install all the necessary dependencies.
   - A critical issue faced during the setup was a **dependency conflict** between `multer-storage-cloudinary` and `cloudinary`. To resolve this, I used the `--legacy-peer-deps` flag during installation:
     ```
     npm install --legacy-peer-deps
     ```

3. **Creating the `.npmrc` File:**
   - A problem with the **Node.js version** occurred on Render. To ensure compatibility, I added the version to the `.npmrc` file:
     ```
     engine-strict=true
     node-version=20.13.1
     ```

4. **Deployment on Render:**
   - The deployment was configured using Render. However, an error related to the `start` script appeared because my `package.json` file was missing the `start` script.
   - I fixed this by adding the following:
     ```json
     "scripts": {
       "start": "node index.js"
     }
     ```
     
5. **Cloud Storage with Cloudinary:**
   - The project required **image uploads** via Cloudinary. I used the `multer-storage-cloudinary` package to handle this, but faced issues with versions. I used the correct version of `cloudinary` to match the peer dependency requirements of `multer-storage-cloudinary`.

6. **Frontend Development:**
   - The frontend was created using **EJS** for rendering dynamic content and **CSS & Bootstrap** for styling. I ensured the design was responsive, using media queries and flexbox to create a layout that works on both desktop and mobile devices.

### Challenges Faced
- **Dependency Conflicts:** 
  - While setting up the project, I encountered conflicts between `multer-storage-cloudinary` and `cloudinary` due to version mismatches. The solution involved using the `--legacy-peer-deps` option to force npm to install dependencies even if they were not fully compatible.
  
- **Start Script Missing:** 
  - The `npm start` command was not recognized during deployment on Render because the `start` script was missing from `package.json`. I resolved this by adding the appropriate script: `"start": "node index.js"`.

- **Cloudinary Configuration Issues:**
  - The initial configuration for uploading images to Cloudinary was tricky due to the need for matching versions between the Cloudinary and Multer packages. I resolved this by ensuring that the `cloudinary` version matched the peer dependency required by `multer-storage-cloudinary`.

### My Approach to Coding
- **Custom Logic Implementation:**
  - Throughout this project, I emphasized implementing my own logic rather than simply copying other people's code. For example, I didn't use any middlewares that would make the process easier, but instead focused on writing my own code to handle different aspects of the app.
  
  - I avoided using middlewares to perform tasks like error handling or routing, preferring to manage them manually. This approach allowed me to learn how each component interacts with the server and gave me full control over the flow of the application.

  - I also created custom validation for user input, like ensuring proper email formats and password strength, without relying on external validation libraries.

## Mapbox and Geocoding Implementation

### Mapbox Integration

- **@mapbox/mapbox-gl-geocoder**  
  (Installed for geocoding and map search functionalities. It allows users to search for locations and get corresponding geographical coordinates, enhancing the user experience by providing an interactive map.)

### Geocoding Logic

- **Geocoding with Coordinates**  
  (The application uses **Mapbox Geocoding API** to convert geographical locations (place names) into coordinates and vice versa. This allows the users to input a location and get the corresponding coordinates, or enter coordinates and get a location name.)
  
  **How it works:**
  
  - The user can input a location name into the form.
  - **Mapbox** API is used to get the corresponding geographical coordinates (latitude and longitude) for the inputted location.
  - The coordinates are stored in the database and used for precise location-based services, such as mapping and distance calculations.
  - We’ve implemented our own logic to ensure the geocoding process is integrated smoothly with the application and does not rely on third-party middleware, enabling more control over the functionality.
  
  This implementation allows users to search locations interactively using a map interface and makes it possible to accurately manage location-based data in listings.

### Deployment
1. **Deploying on Render:**
   - The deployment was successful after fixing the missing `start` script in `package.json` and ensuring that the correct Node.js version was being used.
   
2. **Environment Variables:**
   - I stored sensitive data such as API keys and Cloudinary credentials in environment variables using a `.env` file, ensuring that they were not exposed in the code.

### Final Notes
- The project is now live and can be accessed via the URL https://bnyhavn-airbnb-replica.onrender.com/listings
- The website offers functionality similar to Airbnb and is fully functional, allowing users to register, log in, filter properties, and manage listings.

## Future Improvements
- **Payment Integration:** Implement real payment gateway integration.
- **Advanced Search Filters:** Include more sophisticated filters for property search.
- **Enhanced UI:** Improve the UI with better design elements and interactivity.

## Conclusion
This project helped me build a functional full-stack application from scratch. It was a valuable learning experience, particularly in understanding the entire flow from frontend to backend, as well as integrating third-party services like Cloudinary for media storage.

Thank you for checking out the BNYHAVN Airbnb replica project!
