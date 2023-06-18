"use strict";
(function () {
    var NotificationPlatform;
    (function (NotificationPlatform) {
        NotificationPlatform["SMS"] = "SMS";
        NotificationPlatform["EMAIL"] = "EMAIL";
        NotificationPlatform["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
    })(NotificationPlatform || (NotificationPlatform = {}));
    var ViewMode;
    (function (ViewMode) {
        ViewMode["TODO"] = "TODO";
        ViewMode["REMINDER"] = "REMINDER";
    })(ViewMode || (ViewMode = {}));
    var UUID = function () {
        return Math.random().toString(32).substring(2, 9);
    };
    var DateUtils = {
        tomorrow: function () {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        },
        today: function () {
            return new Date();
        },
        formatDate: function (date) {
            return "".concat(date.getDate(), ".").concat(date.getMonth() + 1, ".").concat(date.getFullYear());
        }
    };
    var Reminder = /** @class */ (function () {
        function Reminder(description, date, notifications) {
            this.id = UUID();
            this.dateCreated = DateUtils.today();
            this.dateUpdated = DateUtils.today();
            this.description = '';
            this.date = DateUtils.tomorrow();
            this.notifications = [NotificationPlatform.EMAIL];
            this.description = description;
            this.date = date;
            this.notifications = notifications;
        }
        Reminder.prototype.render = function () {
            return "\n            ---> Reminder <---\n            description: ".concat(this.description, "\n            date: ").concat(DateUtils.formatDate(this.date), "\n            platform: ").concat(this.notifications.join(','), "\n            ");
        };
        return Reminder;
    }());
    var Todo = /** @class */ (function () {
        function Todo(description) {
            this.id = UUID();
            this.dateCreated = DateUtils.today();
            this.dateUpdated = DateUtils.today();
            this.description = '';
            this.done = false;
            this.description = description;
        }
        Todo.prototype.render = function () {
            return "\n            ---> TODO <---\n            description: ".concat(this.description, "\n            done: ").concat(this.done, "\n            ");
        };
        return Todo;
    }());
    var todo = new Todo("Todo criado com a classe");
    var reminder = new Reminder("Reminder criado com a classe", new Date("06-18-2023"), [NotificationPlatform.EMAIL]);
    var TaskView = {
        getTodo: function (form) {
            var todoDescription = form.todoDescription.value;
            form.reset();
            return new Todo(todoDescription);
        },
        getReminder: function (form) {
            var reminderNotifications = [
                form.notification.value,
            ];
            var reminderDate = new Date(form.scheduleDate.value);
            var reminderDescription = form.reminderDescription.value;
            form.reset();
            return new Reminder(reminderDescription, reminderDate, reminderNotifications);
        },
        render: function (tasks, mode) {
            var taskList = document.querySelector("#tasksList");
            while (taskList === null || taskList === void 0 ? void 0 : taskList.firstChild) {
                taskList.removeChild(taskList.firstChild);
            }
            tasks.forEach(function (task) {
                var li = document.createElement("LI");
                var textNode = document.createTextNode(task.render());
                li.appendChild(textNode);
                taskList === null || taskList === void 0 ? void 0 : taskList.appendChild(li);
            });
            var todoSet = document.querySelector("#todoSet");
            var reminderSet = document.querySelector("#reminderSet");
            if (mode == ViewMode.TODO) {
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('style', 'display: block');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.removeAttribute('disabled');
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute('style', 'display: none');
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute('disabled', 'true');
            }
            else {
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute('style', 'display: block');
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.removeAttribute('disabled');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('style', 'display: none');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('disabled', 'true');
            }
        }
    };
    var TaskController = function (view) {
        var _a, _b;
        var tasks = [];
        var mode = ViewMode.TODO;
        var handleEvent = function (e) {
            e.preventDefault();
            var form = e.target;
            switch (mode) {
                case ViewMode.TODO:
                    tasks.push(view.getTodo(form));
                    break;
                case ViewMode.REMINDER:
                    tasks.push(view.getReminder(form));
                    break;
            }
            view.render(tasks, mode);
        };
        var handleToggleMode = function () {
            switch (mode) {
                case ViewMode.TODO:
                    mode = ViewMode.REMINDER;
                    break;
                case ViewMode.REMINDER:
                    mode = ViewMode.TODO;
                    break;
            }
            view.render(tasks, mode);
        };
        (_a = document.querySelector("#toggleMode")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", handleToggleMode);
        (_b = document.querySelector("#taskForm")) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", handleEvent);
    };
    TaskController(TaskView);
})();
