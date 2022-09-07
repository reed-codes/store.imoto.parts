import React from "react";
import { ImpulseSpinner } from "react-spinners-kit";


const Loader = ({height}) => (
    <div
        style={{
            height: height ? height : 400,
            width: "100%",
            display: "flex",
            background: "#fff",
            alignItems: "center",
            justifyContent: "center"
        }}
    >
        <ImpulseSpinner
            size={70}
            backColor="#eee"
            frontColor="#808080"
        />
    </div>
);    

export default Loader;