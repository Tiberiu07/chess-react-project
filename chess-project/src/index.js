import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

ReactDOM.render(<App />, document.getElementById("root"));

//TO DO LIST
//1. ✔ Setup the Project. Create all the necessary files and make all the necesarry links.
//2. ✔ Research the 3 pieces movement rules
//3. ✔ Add the Chess Table Component and render a mockup in the app
//3. ✔ Implement the Chess Table Component (without pieces yet)
//3.1 ✔ Add the pieces to the Table Component
//4. ✔ Implement the PlayerDashboard UI component
//5. ✔ Implement the ButtonsArea UI component
//6. ✔Implement the GameHistory UI component
//7. Implement app functionality
//7.1 ✔Implement the New Simulation Functionality(Once the Button is clicked, the pieces table are set to null and then initialized)
//7.2 ✔The Game History becomes clear and the updatedState hook is set to true
//7.3 Implement the makeMoveFunction(piece)
//7.3.1 Chooses a random position for the piece given as a parameter
//7.3.2 Chooses the position according to the piece rule
