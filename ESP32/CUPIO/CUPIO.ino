#include <Servo.h>
#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "MMA7660.h"


#define TEMP_PIN 33
#define SERVO_PIN 25

#define UP_ANGLE 120
#define DOWN_ANGLE 60
#define OUT_ANGLE 50
#define TEMP_COEFF 1.045

#define HTTP_PORT 3000

MMA7660 accelemeter;
Servo myservo; 

int dip_delay = 2000;

boolean dip = 0;
boolean servo_position = 0;


const char* ssid     = "NSA-data-collection-van-#42";
const char* password = "cupio2017";



const char* host = "data.sparkfun.com";

void setup() {
  Serial.begin(115200);

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  
  myservo.attach(SERVO_PIN);  // attaches the servo on pin 9 to the servo object
  
  
  
  accelemeter.init();  
}

void loop(){
  boolean sip = 0;
  double temperature = 0;
  static boolean pulled_out = 1;

  if(dip == 1){
  pulled_out = 0;
  dipf();
  }
  else if(dip == 0 && pulled_out == 0){
	pulled_out = 1;
	myservo.write(OUT_ANGLE);

  }

  sip= getSips();
  
  temperature = getTemperature();


  Serial.print("Temperature: ");
  Serial.println(temperature);
  Serial.print("sip:");
  Serial.println(sip);
  
  delay(100);
  
  HTTPClient http;


  if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
 
   HTTPClient http;   
 
   http.begin("http://10.42.0.1:3000/cup/temp");  //Specify destination for HTTP request
   http.addHeader("Content-Type", "application/json");             //Specify content-type header
 
   int httpResponseCode = http.POST(String("{\"temp\":")+temperature + "}");   //Send the actual POST request
 
   if(httpResponseCode>0){
 
      String response = http.getString();                       //Get the response to the request
 
      Serial.println(httpResponseCode);   //Print return code
      Serial.println(response);           //Print request answer
 
   }else{
 
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
 
   }
 
   http.end();  //Free resources
 
  }else{
 
    Serial.println("Error in WiFi connection");   
 
  }
 
  delay(1000);
              




}


boolean getSips(){
  int8_t x;
  int8_t y;
  int8_t z;
  float ax,ay,az;


  accelemeter.getXYZ(&x,&y,&z);

    
  static boolean tilt = 0;

  if(( y > 10 && y < 40) && tilt == 0){
    tilt = 1;
    return 1;
  } else if(( y < 10 || y > 40 ) && tilt == 1){
    tilt = 0;
    return 0;
  }
  return 0;

  



  
  
//  double xa = doubleMap(x, 0, 64, 0, 2*PI);
//  double ya = doubleMap(y, 0, 64, 0, 2*PI);
//  double za = doubleMap(z, 0, 64, 0, 2*PI);
//
//  Serial.println("     cos  \t sin");
//  Serial.print("x = ");
//  Serial.print(cos(xa));
//  Serial.print("\t");
//  Serial.print(sin(xa));
//  Serial.println(); 
//
//  Serial.print("y = ");
//  Serial.print(cos(ya));
//  Serial.print("\t");
//  Serial.print(sin(ya));
//  Serial.println(); 
//
//  Serial.print("z = ");
//  Serial.print(cos(za));
//  Serial.print("\t");
//  Serial.print(sin(za));
//  Serial.println(); 
    

}


double getTemperature(void){
  int sensorValue = analogRead(TEMP_PIN);
  double Vout = (3.300) * sensorValue/ 4096.0;
  return (Vout-TEMP_COEFF)/0.005;  
}


double doubleMap(double x, double in_min, double in_max, double out_min, double out_max)
{
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}



void dipf() {
  static int time2 = millis();
  int now = millis();
  
  if(now - time2 > dip_delay ){
    if(servo_position == 1){
    myservo.write(DOWN_ANGLE);
    servo_position = 0;
   } else if(servo_position == 0){
    myservo.write(UP_ANGLE);
    servo_position = 1;
   }
  time2 = now;
  }
}
