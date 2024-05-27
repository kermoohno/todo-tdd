const TodoController = require('../../controllers/todo.controller')
const TodoModel = require('../../models/todo.model')
const httpMocks = require('node-mocks-http')
const newTodo = require('../mock-data/new-todo.json')
const allTodos = require("../mock-data/all-todos.json");

TodoModel.create = jest.fn()
TodoModel.find = jes.fn()
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jes.fn();

const todoId = "665479a20044ea43608c7e8b";

let req, res, next
beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
})

describe('TodoController.createTodo', () => {
    beforeEach(() => {
        req.body = newTodo
    })
    it('should have a createTodo function', async () => {
        await expect(typeof TodoController.createTodo).toBe('function')
    })
    it('should call TodoModel.create', async () => {
        await TodoController.createTodo(req, res, next)
        expect(TodoModel.create).toBeCalledWith(newTodo)
    })
    it('should return 201 response code', async () => {
        await TodoController.createTodo(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it('should return json body in response', async () => {
        await TodoModel.create.mockReturnValue(newTodo)
        TodoController.createTodo(req, res, next)
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })
    it("should handle errors", async () => {
        const errorMessage = { message: "Done property missing" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.create.mockReturnValue(rejectedPromise);
        await TodoController.createTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
    it("should call TodoModel.find({})", async () => {
        await TodoController.getTodos(req, res, next);
        expect(TodoModel.find).toHaveBeenCalledWith({});
    });
    it("should return response with status 200 and all todos", async () => {
        TodoModel.find.mockReturnValue(allTodos);
        await TodoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allTodos);
    });
    it("should handle errors in getTodos", async () => {
        const errorMessage = { message: "Errror finding" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.find.mockReturnValue(rejectedPromise);
        await TodoController.getTodos(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
    describe("TodoController.getTodoById", () => {
        it("should have a getTodoById", () => {
            expect(typeof TodoController.getTodoById).toBe("function");
        });
        it("should call TodoModel.findById with route parameters", async () => {
            req.params.todoId = "665479a20044ea43608c7e8b";
            await TodoController.getTodoById(req, res, next);
            expect(TodoModel.findById).toBeCalledWith("665479a20044ea43608c7e8b");
        });
        it("should return json body and response code 200", async () => {
            TodoModel.findById.mockRturnValue(newTodo);
            await TodoController.getTodoById(req, res, next);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toStrictEqual(newTodo);
            expect(res._isEndCalled()).toBeTruthy();
        });
        it("should do error handling", async () => {
            const errorMessage = { message: "error fidnding todoModel" };
            const rejectedPromise = Promise.reject(errorMessage);
            TodoModel.findById.mockReturnValue(rejectedPromise);
            expect(next).toHaveBeenCalledWith(errorMessage);
        });
        it("should teturn 404 when item doesnt exist", async () => {
            TodoModel.findById.mockReturnValue(null);
            await TodoController.getTodoById(req, res, next);
            expect(res.statusCode).toBe(404);
            expect(res._isEndCalled()).toBeTruthy();
        });
        describe("TodoController.updateTodo", () => {
            it("should have a updateTodo function", () => {
                expect(typeof TodoController.updateTodo).toBe("function");
            });
    });
    it("should update with TodoModel.findByIdAndUpdate", async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        await TodoController.updateTodo(req, res, next);
        expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
            new: true,
            useFindAndModify:false
            });
        });
    it("should return a response with json data and http code 200", async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
        await TodoController.updateTodo(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res.get_JSONData()).toStrictEqual(newTodo);
    });
    it("should handle errors", async () => {
        const errorMessage = { message: "Error" };
        const rejectedPromise = Promise.reject(errorMessage);
        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await TodoController.updateToDO(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
     });
    it("should handle 404", async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null);
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
    });
});