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

    
    
});

document.addEventListener('edit', function (){

    


    const gallery = document.getElementById('gallery');
    const tab = document.getElementById('tab');
    tab.style.display = 'none';
    


    const select = document.getElementById("scroll");

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
      
        
        
       
            
        
        
       
      
            image = img.children[0];
            console.log(image.src);
            image.style.border = '2px solid #0EB49A';
            caption = img.children[1];
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
     
      src = img.src.replace("http://127.0.0.1:62523", "");
      
      console.log(src);
      
let sky = document.querySelector('a-sky');
    if(e.target.src){
        sky.setAttribute('src', '#'+img.id);
        sky.setAttribute('class',img.id)
        let detail = { id: img.id };
        document.dispatchEvent(new CustomEvent("move", { detail: detail }));
    console.log("move sent");
    }
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


