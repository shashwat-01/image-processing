import axios from "axios";
import { useState,useEffect, useRef } from "react";
import models from "../model.json"

function Modal({ outfit, closeModal , image}) {
	useEffect(() => {
	  document.body.classList.add("overflow-hidden"); // Prevent scrolling when modal is open
  
	  return () => {
		document.body.classList.remove("overflow-hidden"); // Re-enable scrolling when modal is closed
	  };
	}, []);
  
	return (
	  <div>
		<div
		  className="overlay"
		  onClick={closeModal}
		  /* Add style here to cover the entire viewport */
		  style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
		/>
		<div className="fixed inset-0 z-50 flex items-center justify-center">
		  <div className="bg-white p-8 mx-16 rounded-md shadow-lg relative">
			<button
			  onClick={closeModal}
			  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
			>
			  <svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			  >
				<path
				  strokeLinecap="round"
				  strokeLinejoin="round"
				  strokeWidth="2"
				  d="M6 18L18 6M6 6l12 12"
				/>
			  </svg>
			</button>
			<div className="h-5/6 w-full overflow-hidden flex flex-row gap-10">
			  <img
				src={`data:image/jpeg;base64,${image}`}
				alt="Outfit Image"
				className="h-96"
			  />
			  <div className="flex flex-col gap-5">
				<div>
				<h1 className="text-xl">Top Wear</h1>
				<h4 className="text-3xl" style={{fontWeight:"bold"}}>{outfit.top.title}</h4>
				<h2 className="text-xl">INR {outfit.top.price}</h2>
				
				<a href={outfit.top.link} target="_blank" className="text-l font-bold flex flex-row gap-2 items-center cursor-pointer">Buy Now <img
				src='../src/assets/external_link_black.png'
				alt=''
				className='h-3 w-3'
				/></a>				
				</div>
				<hr />
				<div>
				<h1 className="text-xl font">Bottom Wear</h1>
				<h4 className="text-3xl" style={{fontWeight:"bold"}}>{outfit.bottom.title}</h4>
				<h2 className="text-xl">INR {outfit.bottom.price}</h2>
				<a href={outfit.bottom.link} target="_blank" className="text-l font-bold flex flex-row gap-2 items-center cursor-pointer">Buy Now <img
				src='../src/assets/external_link_black.png'
				alt=''
				className='h-3 w-3'
				/></a>
				</div>
			  </div>
			</div>
		  </div>
		</div>
	  </div>
	);
  }
  
  

export default function Outfit({ outfit }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [imgstr , setImgStr] = useState("")

  const effectRan = useRef(false);

  useEffect( () => {

	const callback = async () => {
		const url = "https://b7c47e67cb9989e84d.gradio.live"
		
		const randomIndex = Math.floor(Math.random() * models.length);
		console.log(models[randomIndex].image)
		console.log(outfit.prompt)
    	
	
		const payload = {
			
				// "denoising_strength": 0.7,
				  "prompt": outfit.prompt,
				  "negative_prompt": "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck" ,
				  "steps": 20 ,
				  "sampler_name": "Euler",
				  "alwayson_scripts": {
				  "controlnet": {
					"args": [
					  {
						"input_image": models[2].base64, 
						"module" : "openpose",
						"model" : "control_v11p_sd15_openpose [cab727d4]",
						"pixel_perfect": true,

						// "lowvram" : true,
					  },
					   {
						// "lowvram" : true,
						"input_image": outfit.top.image, 
						"module" : "reference_adain+attn",
						"pixel_perfect": true,
						"threshold_a": 0.6,
						// "control_mode":2,
					// "weight": 1.2,
					  },
			  
					  {
						// "lowvram" : true,
						"input_image": outfit.bottom.image, 
						"module" : "reference_adain+attn",
						"pixel_perfect": true,
						"threshold_a": 0.6,
						// "control_mode":2,

					// "weight": 1.2,
					  }
					]
				  }
				}
			  }

		
	
	
		const res = await axios.post(`${url}/sdapi/v1/txt2img`, payload)
		setImgStr(res.data.images[0])
		
	  }
	
	if (!effectRan.current) {
		callback()
	}

	return () => effectRan.current = true;
	  
  } , [])

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="relative overflow-hidden group">
      {(imgstr === "") ? <div className="h-52 w-40 animate-pulse bg-gray-200 rounded-sm "></div> : <img
        className="h-52 w-40 object-cover rounded-sm transform transition-transform duration-500 ease-in-out group-hover:scale-110 cursor-pointer"
        src={`data:image/jpeg;base64,${imgstr}`}
        onClick={openModal}
      />}
      {modalOpen && <Modal outfit={outfit} closeModal={closeModal} image={imgstr} />}
    </div>
  );
}
