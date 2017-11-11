#include <Servo.h>
#include <Wire.h>
#include <WiFi.h>
#include "MMA7660.h"


#define TEMP_PIN 33
#define SERVO_PIN 25

MMA7660 accelemeter;
Servo myservo; 

int time2 = millis();
int dip_delay = 2000;
int up = 120;
int down = 20;
boolean dip = 0;
boolean servo_position = 0;


const char* ssid     = "NSA-data-collection-van-#42";
const char* password = "sheeting stunt masonry auntie digestion pates";


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

  if(dip == 1){
  dipf();
  }
  Serial.println(time2);



}


void getAngels(int *xa, int *ya, int *za){
  int8_t x;
  int8_t y;
  int8_t z;
  float ax,ay,az;
  accelemeter.getXYZ(&x,&y,&z);

  
  
  Serial.print("x = ");
    Serial.println(map(x,0,64,0,360)); 
    Serial.print("y = ");
    Serial.println(map(y,0,64,0,360));   
    Serial.print("z = ");
    Serial.println(map(z,0,64,0,360));

}


double getTemperature(void){
  int sensorValue = analogRead(TEMP_PIN);
  double Vout = (3.300) * sensorValue/ 4096.0;
  
  return (Vout-1.045)/0.005;  
}





void dipf() {

  int now = millis();
  
  if(now - time2 > dip_delay ){
    if(servo_position == 1){
    myservo.write(down);
    servo_position = 0;
   } else if(servo_position == 0){
    myservo.write(up);
    servo_position = 1;
   }
  time2 = now;
  }
}

