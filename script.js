const draggable_list = document.getElementById("draggable-list");
const searchBar = document.querySelector("#search");
const deleteBtn = document.querySelector(".fa-window-close");
const submitBtn = document.querySelector(".submit-btn");
const resultHeading = document.querySelector("#result-heading");
const results = document.querySelector("#results");
const warning = document.querySelector(".search-term");
const apiKey = "dBL9szFQ0O3PCXPHGxVL9ojSihDkk7qP";
const defaultUrl = "https://giphy.com/";
const imageUrl = "https://static.thenounproject.com/png/994628-200.png";
const baseURL = "https://api.giphy.com/v1/gifs/search";
let text = "";
let dragStartIndex;

//Store listitems
let listItems = [];

function fetchData() {
  // Reset array value
  listItems = [];

  // Delete items from DOM
  draggable_list.innerHTML = "";

  // Fetch data from giphy API
  if (text.trim()) {
    fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=dBL9szFQ0O3PCXPHGxVL9ojSihDkk7qP&q=${text}&limit=3`
    )
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search results for '${text}':</h2>`;
        if (data.data === null || data.data.length === 0) {
          resultHeading.innerHTML = `<p>There are no search results. Try again</p>`;
        } else {
          //Looping through the data array
          data.data.forEach((el, index) => {
            // Create List element
            const listItem = document.createElement("li");

            // Set data attribute
            listItem.setAttribute("data-index", index);

            // Creating list element
            listItem.innerHTML = ` 
            <div class="gif" draggable="true">
            <div class="result-container">
            <figure>
                <img class="picture" src="${el.images.downsized.url}" alt="${
              el.title
            }"</>
                <figcaption class="picture-title">${el.title}</figcaption>
            </figure>
            <div class="details-container">
             <h2>User profile:</h2> 
              <div class="details">
              <div class="username">
              <small>username:</small>
              <h3>${
                el.username === null || el.username.length === 0
                  ? "N/A"
                  : el.username
              }</h3>
         </div> 
         <div>
           <img class="avatar" src="${
             el.user === undefined ? imageUrl : el.user.avatar_url
           }"</>
           <a href="${
             el.user === undefined ? defaultUrl : el.user.profile_url
           }" target="_blank">Check profile</a>
         </div>
        <div class="rating">
        <small>rating:</small>${el.rating.toUpperCase()}
        </div>
    </div>
    </div>
  </div>
  </div>
    `;
            // Push the created items to the array
            listItems.push(listItem);
            // Append items to the DOM
            draggable_list.appendChild(listItem);
            addEventListeners();
          });
        }
      })
      .catch(
        (error) =>
          (resultHeading.innerHTML = `<p>Something went wrong. Please try again later</p>`)
      );
  } else if (text.trim() === "" || searchBar.value === "") {
    warning.style.opacity = 1;

    resultHeading.innerHTML = `<p>There are no search results. Try again</p>`;

    setTimeout(function () {
      warning.style.opacity = 0;
    }, 4000);
  }
}

// Drag events
function dragStart() {
  dragStartIndex = +this.closest("li").getAttribute("data-index");
}

function dragEnter() {
  this.classList.add("over");
}

function dragLeave() {
  this.classList.remove("over");
}

function dragOver(e) {
  e.preventDefault();
  this.classList.add("over");
}
function dragDrop() {
  const dragEndIndex = +this.getAttribute("data-index");
  swapItems(dragStartIndex, dragEndIndex);

  this.classList.remove("over");
}

// Swap Items on drop and append it to the DOM
function swapItems(fromIndex, toIndex) {
  const itemOne = listItems[fromIndex].querySelector(".gif");
  const itemTwo = listItems[toIndex].querySelector(".gif");

  listItems[fromIndex].appendChild(itemTwo);
  listItems[toIndex].appendChild(itemOne);
}

// Add drag&drop eventListeners to the DOM items
function addEventListeners() {
  const draggables = document.querySelectorAll(".gif");
  const dragListItems = document.querySelectorAll(".draggable-list li");
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", dragStart);
  });

  dragListItems.forEach((item) => {
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });
}

//Listens user input and sets text value
searchBar.addEventListener("input", (e) => {
  text = e.target.value;

  if (text.length > 0) {
    deleteBtn.style.opacity = 1;
  } else {
    deleteBtn.style.opacity = 0;
  }
});

// Delets user input in the search bar
deleteBtn.addEventListener("click", () => {
  searchBar.value = "";
  deleteBtn.style.opacity = 0;
  text = "";
});

// Send button click event
submitBtn.addEventListener("click", fetchData);
