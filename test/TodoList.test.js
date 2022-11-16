const { assert } = require("chai");

const TodoList = artifacts.require('./TodoList.sol');

contract('TodoList contract', async() => {
    let todoList;
    before(async () => {
        todoList = await TodoList.deployed();
    });

    it('should exist the address', async() => {
        const address = await todoList.address;

        assert.notEqual(address,0x0);
        assert.notEqual(address,'');
        assert.notEqual(address,null);
    })

    it('should exist a predefined task', async() => {
        const taskCount = (await todoList.taskCount()).toNumber();
        const firstTask = await todoList.tasks(taskCount);

        assert.equal(firstTask.id.toNumber(), taskCount);
    })

    it('should create a new task', async() => {
        const testContent = 'New test Task';
        const result = await todoList.createTask(testContent);
        const taskCount = await todoList.taskCount();

        const event = result.logs[0].args;

        assert.equal(event.id, taskCount.toNumber());
        assert.equal(event.content, testContent);
        assert.equal(event.completed, false);
    })

    it('should mark completed the task', async() => {
        const result = await todoList.toggleTaskComplete(1);
        const task = await todoList.tasks(1);
        const event = result.logs[0].args;

        assert.equal(event.id, 1);
        assert.equal(event.completed, true);
        assert.equal(task.completed, true);
    })
})