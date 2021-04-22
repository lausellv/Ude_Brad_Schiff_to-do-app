function itemTemplate(item){

 return   `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
 <span class="item-text">${item.text}</span>
 <div>
   <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
   <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
 </div>
</li>`
}

//initial pageload rendering
let ourHTML = items.map(function(item){
  return itemTemplate(item)
}).join(''); 
document.getElementById('item-list').insertAdjacentHTML('beforeend', ourHTML)


//create feature
let createField = document.getElementById('create-field');
document
  .getElementById('create-form')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    axios
      .post('/create-item', { text: createField.value })
      .then(function (response) {
     document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
     createField.value = '';
     createField.focus();
      })
      .catch(function () {
        console.log('Please try again later.');
      });
  });

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-me')) {
    // delete feature
    if (confirm('Please confirm deletion')) {
      axios
        .post('/delete-item', { id: e.target.getAttribute('data-id') })
        .then(function () {
          e.target.parentElement.parentElement.remove();
        })
        .catch(function () {
          console.log('Please try again later.');
        });
    }
  }

  // when the user clicks on an edit button to update
  if (e.target.classList.contains('edit-me')) {
    let pastUserInput = e.target.parentElement.parentElement.querySelector(
      '.item-text'
    ).innerHTML;
    console.log(pastUserInput);
    let userInput = prompt('Enter your desired new text', pastUserInput); // saving whatever the user types in this prompt
    //console.log(userInput);  // it will log into the browser console but instead we want to log the value to our node server // we need to use axios
    if (userInput) {
      axios
        .post('/update-item', {
          id: e.target.getAttribute('data-id'),
          text: userInput,
        })
        .then(function () {
          e.target.parentElement.parentElement.querySelector(
            '.item-text'
          ).innerHTML = userInput;
        })
        .catch(function () {
          console.log('Please try again later.');
        });
    }
  }
});
