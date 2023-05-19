/* eslint-disable react-hooks/rules-of-hooks */
import './App.css';
import * as posenet from "@tensorflow-models/posenet";
import  React from 'react';
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "./utilities";
import { useRef,useEffect ,useState} from 'react';
import { auth } from "./firebase";
import "./PracticeExercise.css";
import Navbar from './components/Navbar/navbar';
import TextToSpeech from './TextToSpeech';

function BK() {
   // Web Camera and canvas references
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [camera,setCamera] = useState(false);
   // Characteristics of posenet
  const imageScaleFactor = 0.5;
  const outputStride = 16;
  const flipHorizontal = false;
  const user = auth.currentUser;
  // Displaying messages
  //const [msg,setMsg] = useState(null);
  // Pose detection output arrays
  //let newPoses = [];
  //const p = [];
  // const [output ,setOutput] = useState([])
  // Pose detection
  const [output ,setOutput] = useState("Pose not detected");
  // const [d_pose,setPose] = useState('');
  // Timer variable
  //const [time,setTime] = useState([0,0]);
  const [time,setTime] = useState(0);
  // let iterationCounter1 = 0;
  // let iterationCounter2 = 0;
  let iterationCounter_tree = 0, iterationCounter_w2 = 0,iterationCounter_dD=0, iterationCounter_plank=0/*, iterationCounter = 0*/;
  //let count1=0,count2=0;
  let treecount=0,w2count=0,ddCount=0,plankCount=0;
  //const [count,setCount] = useState([0,0]);
  const [tree_count,setCount_tree] = useState(0);
  const [w2_count,setCount_w2] = useState(0);
  const [dd_count,setCount_dd] = useState(0);
  const [plank_count,setCount_plank] = useState(0);
  //button toggle
  const [btn,setBtn] = useState("Start Camera");
  const [btnStyle,setBtnStyle] = useState("button-33");

  useEffect(() => {
    // We are loading our posenet in this with Input Resolution matching our Canvas
    const runPosenet = async () => {
      const net = await posenet.load({
        inputResolution: { width: 640, height: 480 },
        scale: 0.8,
      });

      setInterval(() => {
        detect(net);
      },1000);
    };

    const detect = async (net) => {
      if (typeof webcamRef.current !== "undefined" 
      && webcamRef.current !== null
      && webcamRef.current.video.readyState === 4) {
        
        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = 640;
        const videoHeight = 480;
        
        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        // Make Detections
        //const poses = await net.estimateMultiplePoses(video,imageScaleFactor,flipHorizontal,outputStride);
        const pose = await net.estimateSinglePose(video,imageScaleFactor,flipHorizontal,outputStride);
        // console.log(poses);
        
        // Storing the number of people in a variable
        //const people = poses.length;
  
        // if(people <=2){
        //   drawCanvas(poses, video, videoWidth, videoHeight, canvasRef,people);
        //   setInterval(() => {
        //     detectPose(people,poses)
        //   },30000);
        // }
        drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
        //setInterval(() => {
        detectPose(pose);
        //},10000);
      }
    };
    runPosenet();
},[]);

// Drawing keypoints and skeleton on the user
const drawCanvas = (poses, video, videoWidth, videoHeight, canvas, people) => {

  // const ctx = canvas.current.getContext("2d");
  canvas.current.width = videoWidth;
  canvas.current.height = videoHeight;
  // canvas.current.width = 640;
  // canvas.current.height = 480;
  const ctx = canvas.current.getContext("2d");

  // Running a loop according to the number of people in frame and drawing a skeleton and keypoints on them
  // for(let i=0; i < people ; i++) {
  //   drawKeypoints(poses[i]["keypoints"], 0.6, ctx);
  //   drawSkeleton(poses[i]["keypoints"], 0.7, ctx);
  // }
  drawKeypoints(poses["keypoints"], 0.6, ctx);
  drawSkeleton(poses["keypoints"], 0.7, ctx);
};
// Detect Pose
const detectPose = async(pose) => {
  var form_data = new FormData();
  if(pose) {
    let count_score =0;
    for(const keypoint of pose.keypoints){
      if(keypoint.score > 0.1){
        count_score = count_score + 1;
      }
    }
    if(count_score >=11) {
      //setOutput("Start Exercise");
      // mapping the keypoints detected of one person into an array
      const features = [];
      var x,y;
      let j=0;
      for(const keypoint of pose.keypoints) {
        x = keypoint.position.x;
        y = keypoint.position.y;
        features.push(x);
        features.push(y);
        form_data.append('json_x'+j,x);
        form_data.append('json_y'+j,y);
        j = j+1
      }
      // console.log(features);
      // Calling our flask backend which predicts the pose
      //https://flaskapp-mk7z.onrender.com/detect
      await fetch('/detect',{
        method: 'POST',
        body: form_data
      }).then((response) => response.text())
      .then((result) => {
        //setOutput(result);
        if(result === 'Tree'){
          setOutput("Tree done properly")
          iterationCounter_tree = iterationCounter_tree + 1;
          setTime(iterationCounter_tree);
          if(iterationCounter_tree === 10){
            treecount = treecount+1;
            setCount_tree(treecount);
            iterationCounter_tree = 0;
          }
        }
        if(result === 'Warrior2'){
          setTime(0);
          setOutput("warrior 2 done properly")
          iterationCounter_w2 = iterationCounter_w2 + 1;
          setTime(iterationCounter_w2);
          if(iterationCounter_w2 === 10){
            w2count = w2count +1;
            setCount_w2(w2count);
            iterationCounter_w2 = 0;
          }
        }
        if(result === 'Downdog'){
          setOutput("Downdog done properly")
          iterationCounter_dD = iterationCounter_dD + 1;
          setTime(iterationCounter_dD);
          if(iterationCounter_dD === 10){
            ddCount = ddCount +1;
            setCount_dd(ddCount);
            iterationCounter_dD = 0;
          }
        }
        if(result === 'Plank'){
          setOutput("Plank done properly")
          iterationCounter_dD = iterationCounter_dD + 1;
          setTime(iterationCounter_plank);
          if(iterationCounter_plank === 10){
            plankCount = plankCount +1;
            setCount_plank(plankCount);
            iterationCounter_plank = 0;
          }
        }
      }).catch((err) => {
        console.log("Error",err);
        setOutput("Sorry facing an issue");
      })
    } else {
      setOutput("Sorry pose not detected");
      setTime(0);
    }
  }
}
// const detectPose = async(pose) =>{
//     // FormData objects are used to capture HTML form and submit it using fetch or another network method.
//     // We are creating an object without a form at all, and then append fields with methods: formData. append(name, value)
//     var form_data = new FormData();
//     //form_data.append('json_people',people);
//     // if(poses) {
//     //   const p = [];
//     //   //newPoses= [];
//     //   for(let i=0;i<people;i++) {
//     //     let count=0;
//     //     const pose = poses[i];
//     //     // counting the score of each detected keypoint. If 10 or more are detected then we classify the pose done by the user
//     //     for(const keypoint of pose.keypoints){
//     //       if(keypoint.score > 0.1){
//     //         count = count+1;
//     //       }
//     //     }
//     //     if(count >= 11) {
//     //     // mapping the keypoints detected of one person into an array
//     //     const features = [];
//     //     var x,y;
//     //     let j=0;
//     //     for(const keypoint of pose.keypoints) {
//     //       // console.log("{keypoint.part}: ({keypoint.position.x},{keypoint.position.y})"");
//     //       x = keypoint.position.x;
//     //       y = keypoint.position.y;
//     //       //features.push({position:{x,y}});
//     //       features.push(x);
//     //       features.push(y);
//     //       // Appending the detected keypoints into another array which we are sending to our backend
//     //       form_data.append('json_x'+j,x);
//     //       form_data.append('json_y'+j,y);
//     //       j = j+1;
//     //     }
//     //     // Calling our flask backend which predicts the pose
//     //     fetch("/detect",{
//     //       method:'POST',
//     //       body:form_data
//     //     }).then(response => response.text())
//     //     .then((result) => {
//     //       //console.log("Person",i+1,":",result)
//     //       // Checking result of person one
//     //       if(result === 'Tree' && (i === 0)){
//     //         p.push({person:i+1,label:result})
//     //         iterationCounter1 = iterationCounter1 + 1;
//     //         setTime([iterationCounter1,iterationCounter2]);
//     //         if(iterationCounter1 === 10){
//     //           setCount([count1+1,count2]);
//     //           iterationCounter1 = 0;
//     //         }
//     //       } else if(i === 0){
//     //         p.push({person:i+1,label:"Wrong Pose Please Follow the instructions"});
//     //         iterationCounter1 = 0;
//     //         setTime([iterationCounter1,iterationCounter2]);
//     //       } // Checking the result of person 2
//     //       else if(result === 'Tree' && (i === 1)) {
//     //         p.push({person:i+1,label:result})
//     //         iterationCounter2 = iterationCounter2 + 1;
//     //         setTime([iterationCounter2,iterationCounter2]);
//     //         if(iterationCounter2 === 10){
//     //           setCount([count1,count2+1]);
//     //           iterationCounter2 = 0;
//     //         }
//     //       } else if(i === 1){
//     //         p.push({person:i+1,label:"Wrong Pose Please Follow the instructions"});
//     //         iterationCounter2 = 0;
//     //         setTime([iterationCounter1,iterationCounter2]);
//     //       }
//     //     }).catch(err => console.log(err))

//     //     // Request Animation Frame tells the browser that you wish to perform an animation and requests 
//     //     // that the browser calls a specified function to update an animation right before the next repaint.
//     //     requestAnimationFrame(detectPose);       
//     //   } else {
//     //       //console.log("Person",i+1,":Pose not detected")
//     //       p.push({person:i+1,label:"Pose not detected. Please Do it properly"});
//     //       setTime([0,0]);
//     //     } 
//     //   }
//     //   newPoses.push(p);
//     //   //console.log(newPoses);
//     //   setOutput(newPoses);
//     // }
//     if(pose) {
//       //console.log(pose.keypoints);
//       let count_score=0;
//       // counting the score of each detected keypoint. If 10 or more are detected then we classify the pose done by the user
//       for(const keypoint of pose.keypoints){
//         //console.log(keypoint);
//         if(keypoint.score > 0.1){
//           count_score= count_score+1;
//         }
//       }
//       if(count_score >= 11) {
//         // mapping the keypoints detected of one person into an array
//         const features = [];
//         var x,y;
//         let j=0;
//         for(const keypoint of pose.keypoints) {
//           // console.log("{keypoint.part}: ({keypoint.position.x},{keypoint.position.y})"");
//           x = keypoint.position.x;
//           y = keypoint.position.y;
//           //features.push({position:{x,y}});
//           features.push(x);
//           features.push(y);
//           // Appending the detected keypoints into another array which we are sending to our backend
//           form_data.append('json_x'+j,x);
//           form_data.append('json_y'+j,y);
//           j = j+1;
//         }
//         // Calling our flask backend which predicts the pose
//         fetch("/detect",{
//           method:'POST',
//           body:form_data
//         }).then(response => response.text())
//         .then((result) => {
//           setPose(result);
//           //console.log(result)
//           // Checking result of one person
//           if(result === 'Tree'){
//             setOutput("Tree done properly")
//             iterationCounter_tree = iterationCounter_tree + 1;
//             setTime(iterationCounter_tree);
//             if(iterationCounter_tree === 10){
//               treecount = treecount+1;
//               setCount_tree(treecount);
//               iterationCounter_tree = 0;
//             }
//           } 
//           if(result ==='Warrior2') {
//             setOutput("Warrior 2 done properly")
//             iterationCounter_w2 = iterationCounter_w2 + 1;
//             setTime(iterationCounter_w2);
//             if(iterationCounter_w2 === 10){
//               w2count = w2count +1;
//               setCount_w2(w2count);
//               iterationCounter_w2 = 0;
//             }
//           } 
//           if(result === 'Downdog') {
//             setOutput("Downdog done properly")
//             iterationCounter_dD = iterationCounter_dD + 1;
//             setTime(iterationCounter_dD);
//             if(iterationCounter_dD === 10){
//               ddCount = ddCount +1;
//               setCount_dd(ddCount);
//               iterationCounter_dD = 0;
//             }
//           } 
//           if(result === 'Plank') {
//             setOutput("Plank done properly")
//             iterationCounter_plank = iterationCounter_plank + 1;
//             setTime(iterationCounter_plank);
//             if(iterationCounter_dD === 10){
//               plankCount = plankCount +1;
//               setCount_plank(plankCount);
//               iterationCounter_plank = 0;
//             }
//           }
//         }).catch(err => console.log(err))

//         console.log(d_pose);
//         // Request Animation Frame tells the browser that you wish to perform an animation and requests 
//         // that the browser calls a specified function to update an animation right before the next repaint.
//         requestAnimationFrame(detectPose);       
//       } else {
//           //console.log("Person",i+1,":Pose not detected")
//           setOutput("Pose not detected. Please Do it properly");
//           setTime(0);
//         } 
//     }
//   };
  // changing the message of our button and starting camera
  const handleStop = () => {
    setBtn("Start Camera")
    setBtnStyle("button-33")
    setCamera(!camera)
    setTime(0);
    setOutput("Pose not detected");
  }
  const handleStart = () => {
    setBtn("Stop Camera")
    setBtnStyle("button-44")
    setCamera(!camera)
    setOutput("Pose not detected");
    setTime(0);
  }
  return (
    <div className="App">
      <header className="App-header">
        <Navbar/>
        <h2 style={{textAlign:"center", marginTop: "100px"}}>{user.displayName}, start performing your "Perfect-Pose" by starting the camera!</h2>
        {/* <p>{output.length}</p> */}
        {/* <div>hello{output.slice(0,3)}</div> */}
        {/* <p>{output[0]}</p> */}
        {/* <div>
          {
            newPoses.map(pose => {
              return (
                <p>{pose}</p>
              )
            })
          }
        </div> */}
        {/* {console.log(output)} */}

        <div>
          {
            // output.map((item,key) => {
            //   return (
            //     <div key={key}>
            //     {
            //       item.map((pose,key) => {
            //         // {console.log(pose)}
            //         return(
            //           <div key={key} style={{
            //             marginTop: "25px",
            //           }}>
            //             <p>{pose.person}{pose.label}</p>
            //             {/* {console.log(pose.person,pose.label)} */}
            //           </div>
            //         )
            //       })
            //     }
            //   </div>
            //   )
            // })
          }
        </div>
        {/* {
            <p style={{
              marginTop:"25px"
            }}>{msg}</p>
        } */}
        {/* {
          pose_res.map(pose => {
            return (
              <div key={pose.person} style={{
                marginTop:"25px"
              }}>
                <p>{pose.person}</p>
                <p>{pose.label}</p>
                {console.log(pose.label)}
              </div>
            )
          })
        } */}
        

        {/* Button that starts the camera and toggles to Stop Camera */}
        <div style={{
          marginLeft: "40%",
          marginRight: "auto",
          display: "flex",
          textAlign:"center"
        }}>
        <button type="button" className={btnStyle} style={{width:"50%"}} onClick={camera ? handleStop: handleStart}>{btn}</button>
        </div>

        {/* Timer */}
        <div style={{
          marginLeft:"40%",
          textAlign:"center",
          display:"flex"
        }}>
          {/* <h1>Timer 1  : </h1>
          <h1 style={{ marginRight:"10px" ,marginLeft:"2px",color:"red"}}>00:0{time[0]}</h1>
          {/* {console.log("P1",time[0])} */}
          {/*<h1>Timer 2  : </h1>
          <h1 style={{ marginRight:"10px" ,marginLeft:"2px",color:"red"}}>00:0{time[1]}</h1> */}
        </div>

        <div style={{
          marginLeft:"40%",
          textAlign:"center",
          display:"flex"
        }}>
          <h1>Timer: </h1>
          <h1 style={{ marginRight:"10px" ,marginLeft:"2px",color:"red"}}>00:0{time}</h1>
        </div>

        {/* Timer
        <div style={{
          marginLeft:"850px",
          textAlign:"center",
        }}>
          <h1>Timer 2</h1>
          <h1>00:0{time[1]}</h1>
        </div> */}

        {/* Webcam, canvas to be able to capture the pose */}
        <div>
          {
            (camera) && 
            <Webcam
            ref={webcamRef}
            style={{
              position: "absolute",
              marginLeft: "840px",
              marginRight: "auto",
              left: 0,
              right: 0,
              // textAlign: "center",
              zindex: 9,
              width: 640,
              height: 480,
            }}/>
          }
          {
            (camera) && 
            <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "840px",
              marginRight: "auto",
              left: 0,
              right: 0,
              // textAlign: "center",
              zindex: 9,
              width: 640,
              height: 480,
            }}/>
          }
        </div>

        <div className="practice-exercise-details" style={{marginLeft:"20px",}}>
          <div className="practice-exercise-info">
            <h3>Pose Analysis : </h3>
            <div>
              {
                // output.filter((item,i,key) => {
                //   if(i+1 === output.length){
                //     // we are returning the last array present in output
                //     return (item)
                //   }
                // }).map((item,key) => {
                //   // <div key={key}>
                //   //   {console.log(item)}
                //   // </div>
                //   return(
                //     <div key={key}>
                //       {
                //         item.map((pose,key) => {
                //           return(
                //             <div key={key}>
                //               <p>Person {pose.person} {pose.label}</p>
                //             </div>
                //           )
                //         })
                //       }
                //     </div>
                //   )
                // })
                // <p>{output}</p>
                <TextToSpeech text={output}></TextToSpeech>
              }
            </div>
          </div>
        </div>
        
        {/* Button that starts the camera and toggles to Stop Camera */}
        {/*<div style={{
          marginLeft:"850px",
          textAlign:"center"
        }}>
          <button type="button" className={btnStyle} style={{
            width:"640px"
          }} onClick={camera ? handleStop: handleStart}>{btn}</button>
        </div>*/}

        {/* <div>
          <p>Person 1: {count[0]}  Person 2: {count[1]}</p>
        </div> */}
        
        {/*}
        <div style={{
          marginLeft:"20px"
        }}>

        <div className="practice-exercise-info">
          <p>Pose: Tree</p><p>Count: {tree_count}</p>
          <p>Pose: Warrior 2 Count: {w2_count}</p>
          <p>Pose: Downdog Count:{dd_count}</p>
          <p>Pose: Plank Count:{plank_count}</p>
        </div>
        </div>
      */}
      <table id="pose-table">
        <tr>
          <th>Pose</th>
          <th>Count</th>
        </tr>
        <tr>
          <td>Tree</td>
          <td>{tree_count}</td>
        </tr>
        <tr>
          <td>Warrior 2</td>
          <td>{w2_count}</td>
        </tr>
        <tr>
          <td>Downdog</td>
          <td>{dd_count}</td>
        </tr>
        <tr>
          <td>Plank</td>
          <td>{plank_count}</td>
        </tr>
      </table>
        
      </header>
    </div>
  );
}

export default BK;
