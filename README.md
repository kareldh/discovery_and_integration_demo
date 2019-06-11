
Live deployment available [here](https://kareldh.github.io/discovery_and_integration_demo/#/).

### OpenLR demo page can be used to experiment with the OpenLR implementation.

Draw a lane on the map bij selecting a path between multiple dots. Click 'Find lines in data' to map the drawn lane to the used road network (Routable Tiles, OpenStreetMap, road register Antwerp).

Click 'Reset' to reset the map. Click demo kruispunt to map the lanes of the junction at the Tropical institute in Antwerp to the chosen map.

You can choose between internal execution in meter or centimeter and encoding the lines vs mapping them directly to LRPs.

### Dataset discovery demo page can be used to get all the geograpghical datasets that intersect with a certain Web Mercator tile.

Select the catalog used and click on the map to get all the datasets that intersect with the Web Mercator tile where the selected location is part of.

When using the verkeerslichtdata_catalog_ttl, click on the found dataset to display its lane defenitions. Display these as raw linestrings or mapped to routable tiles using our OpenLR implementation.

---
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
