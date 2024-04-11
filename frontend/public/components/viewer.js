

function toggleGallery() {
    var gallery = document.getElementById("gallery");
    var tab = document.querySelector(".tab");

    // Function to hide the gallery after transition
    function hideGallery() {
        if (!gallery.classList.contains("is-active")) {
            gallery.style.display = 'none';
            gallery.removeEventListener('transitionend', hideGallery); // Clean up listener
        }
    }

    if (gallery.classList.contains("is-active")) {
        // If gallery is active, remove class and prepare to hide it
        gallery.classList.remove("is-active");
        gallery.addEventListener('transitionend', hideGallery); // Listen for end of transition to hide
    } else {
        // If gallery is not active, show it
        gallery.style.display = 'block'; // Show gallery before starting transition
        // Using requestAnimationFrame to ensure display changes are applied before adding class
        requestAnimationFrame(() => {
            gallery.classList.add("is-active");
        });
    }

    tab.classList.toggle("is-open"); // Toggle the tab arrow direction
}

// Ensure this code runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    var tab = document.querySelector(".tab");
    tab.addEventListener('click', toggleGallery); // Setup click event listener on tab
    const params = new URLSearchParams(window.parent.location.search);
    console.log(params);
  const houseID = params.get('houseID');
  console.log("houseID before loadImageData call: ", houseID);
  loadImages(houseID);
    
    
});
function loadImages(houseId) {
    console.log("loadImageData called with houseId:", houseId);
    fetch('http://localhost:8082/api/house/house/puller/' + houseId)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }
            return response.json(); // Parse the JSON of the response
        })
        .then(data => {
            console.log('House loaded successfully:', data);

            const scroll  = document.querySelector('.scroll-container');
            

            if (scroll && Array.isArray(data[0].images)) {
                data[0].images.forEach((image) => {
                  let container =  document.createElement("div");
                  container.className = "image-container";
                  container.id = "image-container"
                    let imgEl = document.createElement("img");
                    let caption = document.createElement('span');
                    caption.className = "caption";
                    caption.id = "caption";
                    caption.textContent= image.name;
                    imgEl.setAttribute("id", `${image.name}`);
                    imgEl.setAttribute("src", image.imageURL);

                  container.appendChild(imgEl);
                  container.appendChild(caption);
                    scroll.appendChild(container);
                });

                console.log('All images added to <viewer>.', scroll);

                // Assuming the data is an array of image URLs, and you want the first one
              
            }
        })
        .catch(error => {
            console.error('Failed to load image data:', error);
        });
}
function loadImageSelector(houseId , scrollContainer) {
    console.log("loadImageData called with houseId:", houseId);
    fetch('http://localhost:8082/api/house/house/puller/' + houseId)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }
            return response.json(); // Parse the JSON of the response
        })
        .then(data => {
            console.log('House loaded successfully:', data);

           let scroll = scrollContainer;
            

            if (scroll && Array.isArray(data[0].images)) {
                data[0].images.forEach((image) => {
                  let container =  document.createElement("div");
                  container.className = "image-container";
                  container.id = "image-container"
                    let imgEl = document.createElement("img");
                    let caption = document.createElement('span');
                    caption.className = "caption";
                    caption.id = "caption";
                    caption.textContent= image.name;
                    imgEl.setAttribute("id", `${image.name}`);
                    imgEl.setAttribute("src", image.imageURL);

                  container.appendChild(imgEl);
                  container.appendChild(caption);
                    scroll.appendChild(container);
                });

                console.log('All images added to <viewer>.', scroll);

                // Assuming the data is an array of image URLs, and you want the first one
              
            }
        })
        .catch(error => {
            console.error('Failed to load image data:', error);
        });
}

document.addEventListener('edit', function (){

   
    
    

    const gallery = document.getElementById('gallery');
    const tab = document.getElementById('tab');
    tab.style.display = 'none';
    


    const select = document.getElementById("scroll");
    const params = new URLSearchParams(window.parent.location.search);
    console.log(params);
  const houseID = params.get('houseID');
  console.log("houseID before loadImageData call: ", houseID);
loadImageSelector(houseID, select);

    let isDown = false;
    let startX;
    let scrollLeft; 
    let selected;
     console.log(select);
     select.addEventListener('click', (e) => {
        let img = e.target.closest(".image-container");

        if(selected){
        selected.children[0].style.border = "";
        selected.children[1].style.color = "white";
        }
      
        
        
       
            
        
        
       
      
            let image = img.children[0];
            console.log(image.src);
            image.style.border = '2px solid #0EB49A';
           let  caption = img.children[1];
            caption.style.color = "#0EB49A";
            selected = img
            
          

       
        
       
     
       });
       select.addEventListener('mousedown', (e) => {
           isDown = true;
           startX = e.pageX - select.offsetLeft;
           scrollLeft = select.scrollLeft;
           
       });
   
       select.addEventListener('mouseleave', () => {
           isDown = false;
       });
   
       select.addEventListener('mouseup', () => {
           isDown = false;
       });
   
       select.addEventListener('mousemove', (e) => {
           if (!isDown) return;
           e.preventDefault();
           const x = e.pageX - select.offsetLeft;
           const walk = (x - startX) * 3; // The number 3 determines the speed of the scroll
           select.scrollLeft = scrollLeft - walk;
       });


    let inner = gallery.innerHTML;
  
});
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('scroll-container');
   
     
    let isDown = false;
    let startX;
    let scrollLeft;




   




  
    gallery.addEventListener('click', (e) => {
        let img = e.target;
        let src = img.src;
        let overlay = document.getElementById('overlay'); // Assuming you have an overlay element
    
        // Start fade-in effect for the overlay
        overlay.style.transition = 'opacity 0.5s ease-in-out';
        overlay.style.opacity = '1';
        overlay.style.zIndex = '1000';
    
        // Wait for the fade-in to complete
        setTimeout(() => {
            let sky = document.querySelector('a-sky');
            if (img.src) {
                sky.setAttribute('src', src);
                sky.setAttribute('class', img.id);
                let detail = { id: img.id };
                document.dispatchEvent(new CustomEvent("move", { detail: detail }));
                console.log("move sent");
            }
    
            // Start fade-out after setting the new sky image
            overlay.style.opacity = '0';
            // Listen for the end of the fade-out transition
            overlay.addEventListener('transitionend', () => {
                overlay.style.zIndex = '-1'; // Ensure the overlay goes back to being non-interactive
            }, { once: true }); // This ensures the event listener is removed after it fires once
    
        }, 500); // Adjust this timeout based on how long you want the transition to take
    });
    gallery.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
        
    });

    gallery.addEventListener('mouseleave', () => {
        isDown = false;
    });

    gallery.addEventListener('mouseup', () => {
        isDown = false;
    });

    gallery.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - gallery.offsetLeft;
        const walk = (x - startX) * 3; // The number 3 determines the speed of the scroll
        gallery.scrollLeft = scrollLeft - walk;
    });
  
});


