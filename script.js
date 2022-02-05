class List {
  constructor(name) {
    this.name = name;
    this.books = [];
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
  static url = "https://crudcrud.com/api/4cd1fe36b8b046b6adacffb7d72e8110";

  static getAllLists() {
    return $.get(this.url);
  }

  static getList(id) {
    return $.get(this.url + `${id}`);
  }

  static createList(list) {
    return $.post(this.url, list);
  }

  static updateList(list) {
    return $.ajax({
      url: this.url + `/${list._id}`,
      dataType: "json",
      data: JSON.stringify(list),
      contentType: "application/json",
      type: "PUT",
    });
  }
}
