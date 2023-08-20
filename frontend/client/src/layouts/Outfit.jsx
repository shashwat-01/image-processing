import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Outfit({outfit}) {
	console.log(outfit);
	return (
		<div>
			<img src={`data:image/jpeg;base64,${outfit.top.image}`}></img>
		</div>
	)

}