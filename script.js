class List {
  constructor(name) {
    this.name = name;
    this.books = [];
  }

  addBook(title, author, genre) {
    this.books.push(new Book(title, author, genre));
  }
}

class Book {
  constructor(title, author, genre) {
    this.title = title;
    this.author = author;
    this.genre = genre;
  }
}

class ListService {
  static url =
    "https://crudcrud.com/api/4cd1fe36b8b046b6adacffb7d72e8110/lists";

  static getAllLists() {
    return $.get(this.url);
  }

  static getList(id) {
    return $.get(this.url + `${id}`);
  }

  static createList(list) {
    return $.ajax({
      type: "POST",
      url: this.url,
      data: JSON.stringify(list),
      contentType: "application/json",
    });

    // return $.post(this.url, list, (data) => console.log(data));

    // return $.post(this.url, list);
  }

  static updateList(list) {
    const listId = list._id;
    delete list._id;

    return $.ajax({
      type: "PUT",
      url: `${this.url}/${listId}`,
      data: JSON.stringify(list),
      contentType: "application/json",
      // dataType: "json",
    });
  }

  static deleteList(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE",
    });
  }
}

class UI {
  static lists;

  static getAllLists() {
    ListService.getAllLists().then((lists) => this.render(lists));
  }

  static createList(name) {
    ListService.createList(new List(name))
      .then(() => {
        return ListService.getAllLists();
      })
      .then((lists) => this.render(lists));
  }

  static deleteList(id) {
    ListService.deleteList(id)
      .then(() => {
        return ListService.getAllLists();
      })
      .then((lists) => this.render(lists));
  }

  static addBook(id) {
    for (let list of this.lists) {
      if (list._id == id) {
        list.books.push(
          new Book(
            $(`#${list._id}-title`).val(),
            $(`#${list._id}-author`).val(),
            $(`#${list._id}-genre`).val()
          )
        );
        ListService.updateList(list)
          .then(() => {
            return ListService.getAllLists();
          })
          .then((lists) => this.render(lists));
      }
    }
  }

  static deleteBook(listId, bookId) {
    for (let list of this.lists) {
      if (list._id == listId) {
        for (let book of list.books) {
          if (book._id == bookId) {
            list.books.splice(list.books.indexOf(book), 1);
            ListService.updateList(list)
              .then(() => {
                return ListService.getAllLists();
              })
              .then((lists) => this.render(lists));
          }
        }
      }
    }
  }

  static render(lists) {
    this.lists = lists;
    $("#app").empty();
    for (let list of lists) {
      $("#app").prepend(
        `
        <div id="${list._id}" class="card mt-3">
          <div class="card-header">
            <div class="row">
              <div class="col-8">
                <h2>${list.name}</h2>
              </div>
              <div class="col-4 d-grid">
                <button class="btn btn-danger" onclick="UI.deleteList('${list._id}')">Delete</button>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="card">
              <div class="row">
                <div class="col-sm">
                  <input type="text" id="${list._id}-title" class="form-control" placeholder="Title">
                </div>
                <div class="col-sm ">
                  <input type="text" id="${list._id}-author" class="form-control" placeholder="Author">
                </div>
                <div class="col-sm ">
                  <input type="text" id="${list._id}-genre" class="form-control" placeholder="Genre">
                </div>
              </div>
            </div>
            <button id="${list._id}-new-book" onclick="UI.addBook('${list._id}')" class="btn btn-primary form-control mt-3">Add Book</button>
        </div>
        </div>
        `
      );

      for (let book of list.books) {
        $(`#${list._id}`)
          .find(".card-body")
          .append(
            `
          <p class="mt-3">
          <span id="title-${book._id}"><strong>Title: </strong> ${book.title}</span>
          <span id="author-${book._id}"><strong>Author: </strong> ${book.author}</span>
          <span id="genre-${book._id}"><strong>Genre: </strong> ${book.genre}</span>
          <button class="btn btn-danger" onclick="UI.deleteBook('${list._id}', '${book._id}')">Delete book</button>
          `
          );
      }
    }
  }
}

$("#create-new-list").click(() => {
  UI.createList($("#book-list-name").val());
  $("#book-list-name").val("");
});

UI.getAllLists();

// $.get(
//   "https://crudcrud.com/api/4cd1fe36b8b046b6adacffb7d72e8110/unicorns",
//   (data) => console.log(data)
// );
