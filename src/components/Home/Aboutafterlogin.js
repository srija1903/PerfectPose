/*import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "./aboutcs.css";
import { GrYoga } from "react-icons/gr";
import pic from './images/Kalyani.jpg';
import pic1 from './images/Srija.jpg';

export class Aboutafterlogin extends Component {
    componentDidMount(){
        
    (function(d, m){
        var kommunicateSettings = 
            {"appId":"3c6872dbb27f920354a88c06432feac1c","popupWidget":true,"automaticChatOpenOnNavigation":true};
        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        window.kommunicate = m; m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
    }
  render() {
    return (
      <div className="bgm">
        <Navbar/>

        <div className="about-section">
          <h1 style={{textAlign: "center", marginTop: "50px"}}>About PerfectPose: A Virtual Fitness Assistant</h1>
          <p>With the increasing interest in fitness and exercise, there is a growing need for innovative solutions that can improve the effectiveness of workouts and reduce the risk of injury.</p>
          <p>The basic goal of “PerfectPose” is to provide standard and correct exercise poses using Deep Learning and AI/ML</p>
          <p>Main focus is on classifying exercises using PoseNet and KNN classifiers, allowing users to explore the ideal way to perform a particular exercise.</p>
          <p>The system recognizes the discrepancy between actual and target poses and corrects the user with high accuracy</p>
          <p>PerfectPose also provides real-time message or voice-based output along with the necessary instructions to correct the recognized poses.</p>
          <p>Additional features include counting the number of repetitions of a particular exercise and giving message/voice-based feedback to the users.</p>
        </div>

        <hr className="cs"
        style={{
          background: 'black',
          color: 'black',
          borderColor: 'black',
          height: '0.8px',
          width: '80%',
        }}
      />

        <div className="about">
        <h1 style={{textAlign: "center"}}>Our Team</h1>

        <div className="row">
        <div className="column">
            <div className="card">
            <img src={pic} style={{borderRadius: "50%", maxWidth: "16%", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", display: "block", marginLeft: "auto", marginRight: "auto"}}/>
              <div class="container">
                <h2 >Akshaya Thakre</h2>
                <p class="title">1032190142</p>
                <p>Some text that describes me lorem ipsum ipsum lorem.</p>
                <p>Email: jane@example.com</p>
              </div>
            </div>
          </div>

          <div className="column">
            <div className="card">
            <img src={pic} style={{borderRadius: "50%", maxWidth: "16%", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", display: "block", marginLeft: "auto", marginRight: "auto"}}/>
              <div className="container">
                <h2>Kalyani Deshpande</h2>
                <p class="title">1032190940</p>
                <p>Some text that describes me lorem ipsum ipsum lorem.</p>
                <p>Email: mike@example.com</p>
              </div>
            </div>
          </div>

          <div class="column">
            <div class="card">
            <img src={pic} style={{borderRadius: "50%", maxWidth: "16%", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", display: "block", marginLeft: "auto", marginRight: "auto"}}/>
              <div class="container">
                <h2>Shivangi Deshmukh</h2>
                <p class="title">1032190033</p>
                <p>Some text that describes me lorem ipsum ipsum lorem.</p>
                <p>Email: john@example.com</p>
              </div>
            </div>
          </div>

          <div className="column">
            <div className="card">
            <img src={pic1} style={{borderRadius: "50%", maxWidth: "16%", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", display: "block", marginLeft: "auto", marginRight: "auto"}}/>
              <div className="container">
                <h2>Srija Sriram</h2>
                <p class="title">1032191072</p>
                <p>Some text that describes me lorem ipsum ipsum lorem.</p>
                <p>Email: mike@example.com</p>
              </div>
            </div>
          </div>

          </div>
          </div> 
        </div>   
    )
  };
}

export default Aboutafterlogin;*/