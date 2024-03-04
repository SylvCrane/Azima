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
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('scroll-container');
   
    let isDown = false;
    let startX;
    let scrollLeft;
  
    gallery.addEventListener('click', (e) => {
     let img = e.target;
     
      src = img.src.replace("http://127.0.0.1:62523", "");
      
      console.log(src);
      let sky = document.querySelector("a-sky");
    console.log("Class before:", sky.className); 
    if(e.target.src){
    sky.setAttribute("src", "." + src);  
    sky.setAttribute("class", img.id);
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
