import { LightningElement, track } from 'lwc';
import addTodo from '@salesforce/apex/ToDoController.addTodo';
import getCurrentTodos from '@salesforce/apex/ToDoController.getCurrentTodos';


export default class ToDoManager extends LightningElement {
    @track time;
    @track greeting;

    @track todos = [];

    connectedCallback(){
        this.getTime();
        this.fetchToDos();
        //this.populateToDos();

        setInterval(() => {
            this.getTime();
        }, 1000*60);
    }

    getTime(){
        const date = new Date();
        const hour = date.getHours();
        const min  = date.getMinutes();

        this.time = `${this.getHour(hour)}:${this.getDoubleDigit(min)} ${this.getMinDay(hour)}`;

        this.setGreeting(hour);
    }

    getHour(hour){
        return hour === 0 ? 12 : hour > 12 ? (hour - 12) : hour;
    }

    getMinDay(hour){
        return hour >= 12 ? "PM" : "AM";
    }

    getDoubleDigit(digit){
        return digit < 10 ? "0" + digit : digit;
    }

    setGreeting(hour){
        if(hour < 12){
            this.greeting = "Good Morning";
        }else if(hour >= 12 && hour < 17){
            this.greeting = "Good Afternoon";
        }else{
            this.greeting = "Good Evening";
        }
    }

    addToDoHandler(){
        const inputBox = this.template.querySelector("lightning-input");

        const todo = {
            todoName: inputBox.value,
            done: false,
        };

        addTodo({payload : JSON.stringify(todo)})
        .then(response => {
            console.log('Item inserted successfully');
            this.fetchToDos();
        })
        .catch(error => {
            console.error('Error in inserting toDo item '+ error);
        });

        //this.todos.push(todo);
        inputBox.value = "";
    }

    fetchToDos(){
        getCurrentTodos()
        .then(response => {
            if(response){
                console.log('Fetched todos: ', this.todos);
                this.todos = response;
            }
        })
        .catch(error => {
            console.error('Error in fetching todos: ', error);
        });
    }

    updateHandler(){
        this.fetchToDos();
    }

    deleteHandler(){
        this.fetchToDos();
    }

    get upcomingTasks(){
        return this.todos && this.todos.length ? this.todos.filter(todo => !todo.done) : [];
    }

    get completedTasks(){
        return this.todos && this.todos.length ? this.todos.filter(todo => todo.done) : [];
    }

    populateToDos(){
        const todos = [
            {
                todoId: 0,
                todoName: "Learn LWC",
                 done: false,
                 todoDate: new Date()
            },
            {
                todoId: 1,
                todoName: "Learn Apex",
                 done: false,
                 todoDate: new Date()
            },
            {
                todoId: 2,
                todoName: "Learn Aura",
                 done: true,
                 todoDate: new Date()
            }
        ];
        this.todos = todos;
    }
}