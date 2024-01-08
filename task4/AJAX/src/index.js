const isEdit = false;
const form = document.querySelector('.info_form');
const header = document.querySelector('.header h3');
const spinner = document.querySelector('.spinner');

const addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'));
const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));

const editTitleInput = document.getElementById('editTitle');
const editBodyInput = document.getElementById('editBody');
const editImgInput = document.getElementById('editImg');
const editCodeInput = document.getElementById('editCode');
const editDelieverInput = document.getElementById('editDeliever');

const formEdit = document.getElementById('formEdit');

let currentEditId = null; // Глобальная переменная для хранения ID редактируемого товара

async function creatorInfo() {
  try {
    spinner.style.display = 'flex';
    const res = await fetch('http://localhost:3000/creatorInfo');
    const data = await res.json();
    header.textContent = `${data.name} ${data.group} ${data.repo}`;
  } catch (error) {
    console.error(error);
  } finally {
    spinner.style.display = 'none';
  }
}

async function clearAllItems() {
  try {
    const data = await getItems();
    spinner.style.display = 'flex';
    await Promise.all(data.map((item) => deleteItemF(item.id)));
  } catch (error) {
    console.error(error);
  } finally {
    spinner.style.display = 'none';
  }
}

async function getItems() {
  try {
    spinner.style.display = 'flex';
    const res = await fetch('http://localhost:3000/items');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  } finally {
    spinner.style.display = 'none';
  }
}

async function getItem(id) {
  try {
    spinner.style.display = 'flex';
    const res = await fetch(`http://localhost:3000/items/${id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  } finally {
    spinner.style.display = 'none';
  }
}

async function deleteItemF(id) {
  try {
    spinner.style.display = 'flex';
    await fetch(`http://localhost:3000/items/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(error);
  } finally {
    spinner.style.display = 'none';
  }
}

async function editCard(data) {
  try {
    spinner.style.display = 'flex';
    await fetch(`http://localhost:3000/items/${data.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(error);
  } finally {
    spinner.style.display = 'none';
  }
}

async function addItem(data) {
  try {
    spinner.style.display = 'flex';
    const res = await fetch('http://localhost:3000/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (error) {
    console.error(error);
  } finally {
    spinner.style.display = 'none';
  }
}

function showErrorMessage(message) {
  const errorPopup = document.createElement('div');
  errorPopup.classList.add('error-popup');
  errorPopup.textContent = message;
  document.body.appendChild(errorPopup);

  setTimeout(() => {
    errorPopup.remove();
  }, 2000);
}



function openEditModal(id) {
  getItem(id).then((item) => {
    editTitleInput.value = item.title;
    editBodyInput.value = item.body;
    editImgInput.value = item.img;
    editCodeInput.value = item.code;
    editDelieverInput.value = item.deliever;
    
    currentEditId = id; 
    editItemModal.show();
  }).catch(error => {
    console.error('Не удалось получить данные товара:', error);
  });
}


async function editItem(data, id) {
  try {
    spinner.style.display = 'flex';

    data.title = editTitleInput.value;
    data.body = editBodyInput.value;
    data.img = editImgInput.value;
    data.code = editCodeInput.value;
    data.deliever = editDelieverInput.value;

    const response = await fetch(`http://localhost:3000/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      const itemToChange = document.getElementById(id);
      itemToChange.querySelector('img').src = data.img;
      itemToChange.querySelector('.card-title').textContent = data.title;
      itemToChange.querySelector('.card-text').textContent = `Описание: ${data.body}`;
      itemToChange.querySelector('.card-text-deliever').textContent = `Поставщик: ${data.deliever}`;
      itemToChange.querySelector('.id').textContent = `Код товара: ${data.code}`;

      editItemModal.hide();
    } else {
      console.error('Ошибка при редактировании товара:', response.statusText);
    }
  } catch (error) {
    console.error(error);
  } finally {
    spinner.style.display = 'none';
  }
}



function deleteItem(id) {
  const item = document.getElementById(id);
  deleteItemF(id);
  item.remove();
}

const createButton = (isEdit, id) => {
  const button = document.createElement('button');
  button.classList.add('btn');

  if (isEdit) {
    button.classList.add('btn-primary');
    button.textContent = 'Edit';
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const item = await getItem(id);
      editItem(item, id);

      openEditModal();
    });
  } else {
    button.classList.add('btn-danger');
    button.textContent = 'Delete';
    button.addEventListener('click', (e) => {
      e.preventDefault();
      deleteItem(id);
    });
  }

  return button;
};




function addCard({ title, img, body, id, deliever, code }) {
  const container = document.createElement('div');
  container.style.width = '18rem';
  container.classList.add('card');
  container.id = id;

  const imgElement = document.createElement('img');
  imgElement.classList.add('card-img-top');
  imgElement.src = img;
  imgElement.style.height = '50%';
  imgElement.style.width = '100%';

  const info = document.createElement('div');
  info.classList.add('card-body');

  const titleContainer = document.createElement('h5');
  titleContainer.classList.add('card-title');
  titleContainer.textContent = title;

  const bodyContainer = document.createElement('p');
  bodyContainer.classList.add('card-text');
  bodyContainer.textContent = `Описание: ${body}`;

  const providerContainer = document.createElement('p');
  providerContainer.classList.add('card-text-deliever');
  providerContainer.textContent = `Поставщик: ${deliever}`;

  const idContainer = document.createElement('p');
  idContainer.classList.add('id');
  idContainer.textContent = `Код товара: ${code}`;

  const buttonContainer = document.createElement('div');
  const editBtn = createButton(true, id);
  const deleteBtn = createButton(false, id);

  info.append(titleContainer);
  info.append(bodyContainer);
  info.append(providerContainer);
  info.append(idContainer);
  buttonContainer.append(editBtn);
  buttonContainer.append(deleteBtn);
  container.append(imgElement);
  container.append(info);
  container.append(buttonContainer);
  return container;
}

(async function onLoad() {
  const itemsContainer = document.querySelector('.info_items');
  try {
    const items = await getItems();
    items.forEach((item) => itemsContainer.append(addCard(item)));
  } catch (error) {
    console.error(error);
  }
})();

creatorInfo();

async function createItem(obj) {
  try {
    const cardsContainer = document.querySelector('.info_items');
    const res = await addItem(obj);
    cardsContainer.append(addCard(res));
  } catch (error) {
    console.error(error);
  }
}

const toDefault = document.getElementById('defaultClick');
toDefault.addEventListener('click', () => {
  const data = {
    id: 1,
    title: 'Креатинчик',
    body: 'Это белое вещество родом из колумбии поможет вам проводить более эффективные тренировки)))',
    img: 'https://tamadkala.com/wp-content/uploads/2021/11/Sorbitol-1024x1024.png',
    code: '228116',
    deliever: 'ООО КолумбийскийКреатин',
  };

  clearAllItems().then(() => createItem(data).then(() => window.location.reload()));
});

form.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  if (!isEdit) {
    const obj = {};
    const inputs = evt.target.querySelectorAll('input');
    let hasEmptyFields = false; 

    inputs.forEach((item) => {
      obj[item.id] = item.value;
      if (item.value.trim() === '') {
        hasEmptyFields = true;
      }
    });

    if (hasEmptyFields) {
      showErrorMessage('Заполните все поля перед добавлением.');
    } else {
      createItem(obj);
      inputs.forEach((item) => (item.value = ''));

      addItemModal.hide();
    }
  }
});

formEdit.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  const updatedData = {
    title: editTitleInput.value,
    body: editBodyInput.value,
    img: editImgInput.value,
    code: editCodeInput.value,
    deliever: editDelieverInput.value
  };

  editCard(updatedData, currentEditId)
    .then(updatedItem => {
      const itemToChange = document.getElementById(currentEditId);
      if (itemToChange) {
        itemToChange.querySelector('.card-title').textContent = updatedData.title;
        itemToChange.querySelector('.card-text').textContent = `Описание: ${updatedData.body}`;
        itemToChange.querySelector('.card-text-deliever').textContent = `Поставщик: ${updatedData.deliever}`;
        itemToChange.querySelector('.card-img-top').src = updatedData.img;
      }
      editItemModal.hide(); 
    })
    .catch(error => {
      console.error('Ошибка при обновлении товара:', error);
      showErrorMessage('Ошибка при обновлении товара');
    });
});



const openModalButton = document.getElementById('openModalButton');
openModalButton.addEventListener('click', () => {
  addItemModal.show();
});
