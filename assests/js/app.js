const cl = console.log;

const postform = document.getElementById("postform");
const todoItemControl = document.getElementById("todoItem");
const todocontainer = document.getElementById("todocontainer");
const submitBtn = document.getElementById("submitBtn");
const updatetBtn = document.getElementById("updateBtn");

let todoArr = [];

if (localStorage.getItem("todoArry")) {
  todoArr = JSON.parse(localStorage.getItem("todoArry"));
}

const onEdit = (ele) => {
  let id = ele.parentElement.parentElement.getAttribute("id");

  cl("Edited !!!", id);

  let todoObj = todoArr.find((todo) => {
    return todo.todoId === id;
  });

  localStorage.setItem("editId", JSON.stringify(todoObj));

  cl(todoObj);

  todoItemControl.value = todoObj.todoItem;
  submitBtn.classList.add("d-none");
  updatetBtn.classList.remove("d-none");
};

const onDelete = (ele) => {
  cl(ele.closest("li"));

  Swal.fire({
    title: "Are you sure, you want to remove this todo item?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let deleteId = ele.closest("li").id;
      cl(deleteId);

      let deleteIndex = todoArr.findIndex((obj) => {
        return obj.todoId === deleteId;
      });

      todoArr.splice(deleteIndex, 1);
      cl(todoArr);

      localStorage.setItem("todoArry", JSON.stringify(todoArr));

      ele.closest("li").remove();
      Swal.fire({
        title: "Deleted!",
        text: "Your todo item has been deleted.",
        icon: "success",
        timer: 3000,
      });
    }
  });
};

const templating = (arr) => {
  let result = ``;
  arr.forEach((todoObj) => {
    result += `
                        <li class="list-group-item d-flex justify-content-between" id="${todoObj.todoId}">
                            <strong> 
                              ${todoObj.todoItem}
                            </strong>


                            <span>
                                  <i class="fa-solid fa-pen-to-square text-primary" onclick="onEdit(this)"></i>
                                  <i class="fa-solid fa-trash text-danger ml-2" onclick="onDelete(this)"></i>
                                            
                            </span>
                            
                        </li>
                        `;
  });

  todocontainer.innerHTML = result;
};

templating(todoArr);

const generateUuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (charcter) => {
    const random = (Math.random() * 16) | 0;
    const value = charcter === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

const todoAddHandler = (eve) => {
  eve.preventDefault();
  cl(todoItem.value);
  let todoObj = {
    todoItem: todoItemControl.value,
    todoId: generateUuid(),
  };

  eve.target.reset();
  todoArr.push(todoObj);

  localStorage.setItem("todoArry", JSON.stringify(todoArr));

  const li = document.createElement("li");
  li.className = "list-group-item d-flex justify-content-between";
  li.id = todoObj.todoId;
  li.innerHTML = `
                    <strong> 
                      ${todoObj.todoItem}
                    </strong>

                    <span>
                          <i class="fa-solid fa-pen-to-square text-primary" onclick="onEdit(this)"></i>
                          <i class="fa-solid fa-trash text-danger ml-2" onclick="onDelete(this)"></i>                        
                    </span>
        
                  `;

  cl(li);

  todocontainer.append(li);
  Swal.fire({
    icon: "success",
    text: `${todoObj.todoItem} is added in todo skill bucketlist`,
    timer: 3000,
  });
};

const onUpdateHandler = () => {
  let updatedvalue = todoItemControl.value;
  cl(updatedvalue);

  let getEditObj = JSON.parse(localStorage.getItem("editId"));
  cl(getEditObj);

  for (let i = 0; i < todoArr.length; i++) {
    if (todoArr[i].todoId === getEditObj.todoId) {
      todoArr[i].todoItem = updatedvalue;
      break;
    }
  }

  localStorage.setItem("todoArry", JSON.stringify(todoArr));

  let firstChild = document.getElementById(getEditObj.todoId).firstElementChild;

  Swal.fire({
    icon: `success`,
    text: `${getEditObj.todoItem} is updated to ${updatedvalue}`,
    timer: 3000,
  });

  firstChild.innerHTML = updatedvalue;

  postform.reset();
  updatetBtn.classList.add("d-none");
  submitBtn.classList.remove("d-none");
};

postform.addEventListener("submit", todoAddHandler);
updatetBtn.addEventListener("click", onUpdateHandler);
