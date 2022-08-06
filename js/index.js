// Getting notes from localstorage
let lsNote = localStorage.getItem("note");
if (lsNote == null) {
  arrNote = [];
} else {
  arrNote = JSON.parse(lsNote);
}

// Note Body
let noteBody = (uid, title, text, imp) => {
  let element = document.createElement("div");
  element.classList.add("note", imp);
  element.setAttribute("data-uid", uid);
  element.innerHTML = `<div class="note-header">
                        <button class="btn star" onclick="impNote(this)"><span class="iconify" data-icon="carbon:star-filled"></span></button>
                           <div class="btn-wrapper">
                              <button class="btn save" onclick="saveNote(this,'update')"><span class="iconify" data-icon="fa-solid:save"></span></button>
                              <button class="btn edit" onclick="editNote(this)"><span class="iconify" data-icon="ant-design:edit-filled"></span></button>
                              <button class="btn" onclick="deleteNote(this)"><span class="iconify" data-icon="fluent:delete-32-filled"></span></button>
                           </div>
                        </div>
                        <div class="note-body">
                           <textarea name="title" placeholder="Title" rows="1" class="title" disabled>${title}</textarea>
                           <textarea name="text" placeholder="Enter Note" rows="7" class="text" disabled>${text}</textarea>
                        </div>`;

  document.querySelector(".note-wrapper").prepend(element);
};

// Display Empty notebox for input
const showEmpty = (no) => {
  const note = document.querySelector(".note.empty");
  const wrapper = document.querySelector(".note-wrapper");
  const btn = document.querySelector(".blank-btn");
  if (no == 1) {
    note.style.display = "inline-block";
    btn.style.bottom = "-100px";
  } else if (no == 0) {
    note.style.display = "none";
    btn.style.bottom = "20px";
  } else {
    if (wrapper.childElementCount >= 1) {
      note.style.display = "none";
    } else {
      note.style.display = "inline-block";
    }
  }
};

// Display all notes
const showNote = () => {
  const wrapper = document.querySelector(".note-wrapper");

  if (arrNote.length >= 1) {
    showEmpty(0);
    arrNote.forEach((e) => {
      noteBody(e.uid, e.title, e.text, e.imp);
    });
  } else {
    showEmpty(1);
  }
};
showNote();

// delete notes
const deleteNote = (e, action) => {
  const note = e.parentNode.parentNode.parentNode;
  const uid = note.getAttribute("data-uid");

  arrNote.forEach((e, index) => {
    if (e.uid == uid) {
      arrNote.splice(index, 1);
      localStorage.setItem("note", JSON.stringify(arrNote));
    }
  });
  note.remove();
  showEmpty();
};

// save notes
const saveNote = (e, action) => {
  const note = e.parentNode.parentNode.parentNode;
  const title = note.children[1].children[0];
  const text = note.children[1].children[1];

  if (title.value.length > 2 && text.value.length > 2) {
    if (action == "update") {
      const uid = note.getAttribute("data-uid");

      arrNote.forEach((e, index) => {
        if (e.uid == uid) {
          arrNote[index] = {
            uid: uid,
            title: title.value,
            text: text.value,
            imp: "no",
          };
          localStorage.setItem("note", JSON.stringify(arrNote));
        }
      });
      title.setAttribute("disabled", true);
      text.setAttribute("disabled", true);
      note.classList.remove("edit-mode");
    } else {
      const uid = () => {
        if (arrNote.length >= 1) {
          let temp = [];
          arrNote.forEach((e) => temp.push(e.uid));
          return Math.max(...temp);
        } else {
          return 0;
        }
      };
      arrNote.push({
        uid: uid() + 1,
        title: title.value,
        text: text.value,
        imp: "no",
      });
      localStorage.setItem("note", JSON.stringify(arrNote));

      noteBody(uid() + 1, title.value, text.value);
      title.value = "";
      text.value = "";
      note.style.display = "none";
    }
  }
  document.querySelector(".blank-btn").style.bottom = "20px";
};

// edit notes
const editNote = (e) => {
  const note = e.parentNode.parentNode.parentNode;
  const title = note.children[1].children[0];
  const text = note.children[1].children[1];

  title.removeAttribute("disabled");
  text.removeAttribute("disabled");
  note.classList.add("edit-mode");
};

// add Imp(stared) to note
const impNote = (e) => {
  const note = e.parentNode.parentNode;
  const uid = note.getAttribute("data-uid");
  const title = note.children[1].children[0];
  const text = note.children[1].children[1];

  arrNote.forEach((e, index) => {
    if (e.uid == uid) {
      arrNote[index] = {
        uid: uid,
        title: title.value,
        text: text.value,
        imp: "imp",
      };
      localStorage.setItem("note", JSON.stringify(arrNote));
    }
  });
  note.classList.add("imp");
};

// For Search Notes
const searchBlur = (e) => {
  const note = document.querySelector(".note-wrapper").children;
  Array.from(note).forEach((element) => {
    const title = element.children[1].children[0].innerHTML.toLocaleLowerCase();
    const input = e.value.toLocaleLowerCase();

    if (title.includes(input)) {
      element.style.display = "inline-block";
    } else {
      element.style.display = "none";
    }
  });
};

// For checking live length of user input
let textarea = document.querySelector(".note-body").children;
Array.from(textarea).forEach((element) => {
  element.addEventListener("input", (e) => {
    if (e.target.value.length > 2) {
      element.classList.remove("error");
    } else {
      element.classList.add("error");
    }
  });
});
