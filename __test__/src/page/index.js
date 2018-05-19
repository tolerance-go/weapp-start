// import debounce from 'lodash/debounce';
import utils from '../utils';

Page({
  data: {
    todos: [],
    // 全部完成，全部撤销
    allDone: true,
  },
  onKeyInput({ detail: { value } }) {
    this.setData({
      inputVal: value,
    });
  },
  onTodo() {
    const { todos, inputVal } = this.data;
    if (!inputVal) {
      return wx.showToast({
        title: '还不知道你准备干吗呢~',
        icon: 'none',
      });
    }
    this.setData({
      inputVal: '',
      todos: todos
        .concat({
          todo: inputVal,
        })
        .map((item, idx) => {
          item.id = idx;
          return item;
        }),
    });
  },
  onRemove({ detail }) {
    const { todos } = this.data;
    this.setData({
      todos: todos.filter(item => {
        return item.id !== detail.id;
      }),
    });
  },
  onDone({ detail }) {
    const { todos } = this.data;
    this.setData({
      todos: todos.map(item => {
        if (detail.id === item.id) {
          item.done = !item.done;
        }
        return item;
      }),
    });
  },
  onRemoveAll() {
    this.setData({
      todos: [],
    });
  },
  onDoneAll() {
    this.setData({
      todos: this.data.todos.map(item => {
        item.done = this.data.allDone;
        return item;
      }),
      allDone: !this.data.allDone,
    });
  },
});
