// 0 uninitialized
// 1 sent
// 2 
// 3 Loading
// 4 Done



var availableSearchQueries = ['carrot', 'broccoli', 'asparagus', 'cauliflower', 'corn', 'cucumber', 'green pepper', 'lettuce', 'mushrooms', 'onion', 'potato', 'pumpkin', 'red pepper'
    , 'tomato', 'beetroot', 'brussel sprouts', 'peas', 'zucchini', 'radish', 'sweet potato', 'artichoke', 'leek', 'cabbage', 'celery', 'chili'
    , 'garlic', 'basil', 'coriander', 'parsley', 'dill', 'rosemary', 'oregano', 'cinnamon', 'saffron', 'green bean', 'bean', 'chickpea'
    , 'lentil', 'apple', 'apricot', 'avocado', 'banana', 'blackberry', 'blackcurrant', 'blueberry', 'boysenberry', 'cherry', 'coconut', 'fig', 'grape'
    , 'grapefruit', 'kiwifruit', 'lemon', 'lime', 'lychee', 'mandarin', 'mango', 'melon', 'nectarine', 'orange', 'papaya', 'passion fruit'
    , 'peach', 'pear', 'pineapple', 'plum', 'pomegranate', 'quince', 'raspberry', 'strawberry', 'watermelon', 'salad', 'pizza'
    , 'popcorn', 'pasta', 'lobster', 'steak', 'bbq', 'pudding', 'hamburger', 'pie', 'cake', 'sausage', 'tacos', 'kebab', 'poutine'
    , 'seafood', 'chips', 'fries', 'masala', 'paella', 'som tam', 'chicken', 'toast', 'marzipan', 'tofu', 'ketchup', 'hummus'
    , 'chili', 'maple syrup', 'parma ham', 'fajitas', 'champ', 'lasagna', 'poke', 'chocolate', 'croissant', 'arepas',
    'bunny chow', 'pierogi', 'donuts', 'rendang', 'sushi', 'ice cream', 'duck', 'curry', 'beef', 'goat', 'lamb', 'turkey'
    , 'pork', 'fish', 'crab', 'bacon', 'ham', 'pepperoni', 'salami', 'ribs'];
var searchTab = document.getElementById('searchTab');
var searchBtn = document.getElementById('searchBtn');
var faceReact = document.querySelector('.faceReact');
var allMeals = [];
var arrOfRecipeID = [];
var arrOfRecipeDetails = [];
var btn_getRecipe;

searchTab.addEventListener('keyup', function () {
    var container = '';
    if (searchTab.value != '') {
        for (var i = 0; i < availableSearchQueries.length; i++) {
            if (availableSearchQueries[i].includes(searchTab.value.toLowerCase())) {
                container += `
                    <tr>
                                <td class="px-4">${availableSearchQueries[i]}</td>
                                </tr>
                                `
            }
        }
    }
    else {
        faceReact.innerHTML = '<i class="fa-solid fa-face-rolling-eyes"></i>';
        faceReact.querySelector('i').style.animation = "scaling .8s linear 0s 1 forwards alternate";

    }
    //Display all keywords matchs found in tbody(searchQueries)
    document.querySelector('.searchQueries').innerHTML = container;
    //after Display all tr's to tbody(searchQueries) innerHTML catch all of them in tableRows Array list
    // to able us to access each cells and make our click event on each cell "td" to display the kedyword
    // to search tab.
    if (searchTab.value != '') {
        var tableRows = document.querySelectorAll('tr');
        for (var i = 0; i < tableRows.length; i++) {
            tableRows[i].cells[0].addEventListener('click', function (e) {
                searchTab.value = e.target.innerHTML;
                //After adding the search keyword value into search bar by clicked on it clear the tbody(searchQueries)
                document.querySelector('.searchQueries').innerHTML = '';
            })
        }
    }
})


searchBtn.addEventListener('click', function () {
    allMeals = [];
    arrOfRecipeID = [];
    arrOfRecipeDetails = [];
    reqData(searchTab.value);
    document.querySelector('.searchQueries').innerHTML = '';
})



function reqData(searchFor) {
    var req = new XMLHttpRequest();
    req.open('get', `https://forkify-api.herokuapp.com/api/search?q=${searchFor}`);
    req.send();
    req.addEventListener('loadend', function () {
        if (req.status == 200) {
            allMeals = JSON.parse(req.response).recipes;
            displayAllMeals();
            (
                async function () {
                    for (var i = 0; i < allMeals.length; i++) {
                        arrOfRecipeID.push(allMeals[i].recipe_id);
                        var response = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${arrOfRecipeID[i]}`);
                        var ObjectOfRecipeDetails = await response.json();
                        arrOfRecipeDetails.push(ObjectOfRecipeDetails);

                    }
                    btn_getRecipe = document.querySelectorAll('.btn-getRecipe');

                    for (var i = 0; i < btn_getRecipe.length; i++) {

                        btn_getRecipe[i].addEventListener('click', function (i) {
                            var arrOfIngredients = arrOfRecipeDetails[i].recipe.ingredients;
                            document.querySelector('.modal-title').innerHTML = arrOfRecipeDetails[i].recipe.title;
                            var container = '';
                            for (var i = 0; i < arrOfIngredients.length; i++) {
                                container += `<li class="mb-1">${arrOfIngredients[i]}</li>`;
                            }
                            document.querySelector('.ing-list').innerHTML = container;
                        }.bind(null, i));

                    }
                }
            )();
            faceReact.innerHTML = '<i class="fa-solid fa-face-grin-tongue"></i>';
            faceReact.querySelector('i').style.animation = "scaling .8s linear 0s 1 forwards alternate";
            // faceReact.querySelector('i').style.color = "#FFCA2C";

        }
        else {
            faceReact.innerHTML = '<i class="fa-solid fa-face-sad-cry"></i>';
            faceReact.querySelector('i').style.animation = "scaling .8s linear 0s 1 forwards alternate";

        }
    })
}
function displayAllMeals() {
    var container = '';
    for (var i = 0; i < allMeals.length; i++) {
        container += `
        <div class="col-lg-3 col-sm-6 my-3">
        <figure>
            <a target="_blank" href="${allMeals[i].source_url}">
                <img class="w-100" src="${allMeals[i].image_url}" alt="burger, burger recipe">
            </a>
            <figcaption class="p-3 bg-danger">
                <h2 class="h5 text-center fw-bold text-warning">${allMeals[i].title}
                    <span class="fw-normal h6 d-block pt-2"> - <a class="text-light"
                    target="_blank"  href="${allMeals[i].publisher_url}">${allMeals[i].publisher}</a></span>
                </h2>
                <!-- Button trigger modal -->
                <button type="button" class="btn-getRecipe d-block btn btn-warning mt-3 m-auto"
                    data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Get Recipe
                </button>
            </figcaption>
        </figure>
    </div>
        `
    }
    document.querySelector('.row').innerHTML = container;
}