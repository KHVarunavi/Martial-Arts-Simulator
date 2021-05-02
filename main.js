var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

let start = 0;
let loadImage = (src, callback) => {
  var img = document.createElement("img");
  img.onload = () => callback(img);
  img.src = src;
};
let animations = ["idle", "kick", "punch", "backward", "block", "forward"];
let frames = {
   idle: [1, 2, 3, 4, 5, 6, 7, 8],
   kick: [1, 2, 3, 4, 5, 6, 7],
   punch: [1, 2, 3, 4, 5, 6, 7],
   backward: [1, 2, 3, 4, 5, 6],
   block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
   forward: [1, 2, 3, 4, 5, 6],
};
let imagePath = (frameNumber, animation) => "images/" + animation + "/" + frameNumber + ".png";
//Loading all the idle images
let loadImages = (callback) => {
  let images = { idle: [], kick: [], punch: [], backward: [], block: [], forward: []}
  let imagesToLoad = 0;
  animations.forEach((animation) => {
    let animationFrames = frames[animation];
    imagesToLoad = imagesToLoad + animationFrames.length;
    animationFrames.forEach((frameNumber) => {
      let path = imagePath(frameNumber, animation);

      loadImage(path, (img) => {
         images[animation][frameNumber - 1] = img;
         imagesToLoad = imagesToLoad - 1;

         if (imagesToLoad === 0) {
            callback(images);
          }
      });
    });
  });
};

let animate = (context, images, animation, callback) => {
  images[animation].forEach((image, index) => {
    setTimeout(
      () => {
         context.clearRect(0, 0, 900, 500);
         context.drawImage(image, start, 0, 500, 500);
         if(animation == "forward"){
            if(start+500+15<=900)  start+=15;
         }
         if(animation == "backward"){
            if(start-15>=0)  start-=15;
         }
      },
      index * 100);
  });
  

  setTimeout(callback, images[animation].length * 100);
};

loadImages((images) => {
   let queuedAnimation = [];

   
   let aux = () =>{
      let selectedAnimation;
      if(queuedAnimation.length === 0) selectedAnimation = "idle";
      else selectedAnimation = queuedAnimation.shift();
      animate(context, images, selectedAnimation, aux);
   }
   aux();

   document.getElementById("kick").onclick = () => {
      queuedAnimation.push("kick");
   }
   document.getElementById("punch").onclick = () => {
      queuedAnimation.push("punch");
   }
   document.getElementById("backward").onclick = () => {
      queuedAnimation.push("backward");
   }
   document.getElementById("block").onclick = () => {
      queuedAnimation.push("block");
   }
   document.getElementById("forward").onclick = () => {
      queuedAnimation.push("forward");
   }
   document.addEventListener("keyup", (event) => {
      const key = event.key;
      if(key == "ArrowLeft"){
         queuedAnimation.push("kick");
      }
      else if(key == "ArrowRight"){
         queuedAnimation.push("punch");
      }
      else if(key == "ArrowUp"){
         queuedAnimation.push("forward");
      } 
      else if(key == "ArrowDown"){
         queuedAnimation.push("backward");
      }
      else if(key == "Space"){
         queuedAnimation.push("block");
      }
   })
});
