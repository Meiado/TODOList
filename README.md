# Aplicativo de Gerenciamento de Tarefas em TypeScript

Este é um aplicativo simples de gerenciamento de tarefas escrito em TypeScript. Ele permite que você crie e visualize tarefas do tipo "TODO" e lembretes com opções de notificação.

## Funcionalidades

- Criação e exibição de tarefas do tipo "TODO".
- Criação e exibição de lembretes com opções de notificação.
- Alternância entre os modos de visualização de "TODO" e "Lembrete".

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- Node.js (versão 18.12.1)
- npm (gerenciador de pacotes do Node.js, geralmente instalado junto com o Node.js)

## Instalação

1. Clone este repositório para o seu diretório local:

```bash
git clone https://github.com/Meiado/TODOList.git
```

2. Navegue até o diretório do projeto:

```bash
cd TODOList
```

3. Instale as dependências usando o npm:

```bash
npm install
```

## Uso

1. Execute o aplicativo:

```bash
npm start
```

2. Abra o navegador e acesse http://localhost:3000 para interagir com o aplicativo.

## Funcionalidades

O aplicativo oferece as seguintes funcionalidades:

- Criação de tarefas "TODO":
  - Preencha o campo de descrição e pressione "Criar Tarefa".
  - As tarefas "TODO" serão exibidas na seção correspondente.

- Criação de lembretes:
  - Preencha a descrição, selecione uma data e plataforma de notificação, depois pressione "Criar Lembrete".
  - Os lembretes serão exibidos na seção correspondente.

- Alternância entre modos:
  - Clique no botão "Alternar Modo" para alternar entre os modos de visualização de tarefas "TODO" e lembretes.
  - Os elementos de entrada correspondentes serão habilitados/desabilitados conforme o modo atual.

## Arquivo `index.ts`

O arquivo `index.ts` contém o código principal do aplicativo. Ele define classes para tarefas do tipo "TODO" e lembretes, bem como funções para manipulação da interface de usuário e controle das tarefas.

```typescript
(() => {
    enum NotificationPlatform {
        SMS = 'SMS',
        EMAIL = 'EMAIL',
        PUSH_NOTIFICATION = 'PUSH_NOTIFICATION'
    }

    enum ViewMode {
        TODO = 'TODO',
        REMINDER = 'REMINDER'
    }

    const UUID = (): string => {
        return Math.random().toString(32).substring(2,9)
    } 

    const DateUtils = {
        tomorrow(): Date {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate()+1)
            return tomorrow
        },

        today(): Date {
            return new Date()
        },

        formatDate(date : Date): string {
            return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`
        }
    }

    interface Task {
        id: string
        dateCreated: Date
        dateUpdated: Date
        description: string
        render(): string
    }

    class Reminder implements Task {
        id: string = UUID();
        dateCreated: Date = DateUtils.today()
        dateUpdated: Date = DateUtils.today()
        description: string = ''

        date: Date = DateUtils.tomorrow()
        notifications: Array<NotificationPlatform> = [NotificationPlatform.EMAIL]

        constructor(description: string, date: Date, notifications: Array<NotificationPlatform>) {
            this.description = description
            this.date = date
            this.notifications = notifications
        }

        render(): string {
            return `
            ---> Reminder <---
            description: ${this.description}
            date: ${DateUtils.formatDate(this.date)}
            platform: ${this.notifications.join(',')}
            `
        }
    }

    class Todo implements Task {
        id: string = UUID()
        dateCreated: Date = DateUtils.today()
        dateUpdated: Date = DateUtils.today()
        description: string = ''

        done: boolean = false

        constructor(description: string) {
            this.description = description
        }
        
        render(): string {
            return `
            ---> TODO <---
            description: ${this.description}
            done: ${this.done}
            `
        }

    }

    const todo = new Todo("Todo criado com a classe")

    const reminder = new Reminder("Reminder criado com a classe", new Date("06-18-2023"), [NotificationPlatform.EMAIL])

    const TaskView = {

        getTodo(form: HTMLFormElement) : Todo {
            const todoDescription = form.todoDescription.value
            form.reset()
            return new Todo(todoDescription)
        },

        getReminder(form: HTMLFormElement) : Reminder {
            const reminderNotifications = [
                form.notification.value as NotificationPlatform,
            ]
            const reminderDate = new Date(form.scheduleDate.value)
            const reminderDescription = form.reminderDescription.value
            form.reset()
            return new Reminder(
                reminderDescription,
                reminderDate,
                reminderNotifications
            )
        },

        render(tasks : Array<Task>, mode: ViewMode) {
            const taskList = document.querySelector("#tasksList")
            while(taskList?.firstChild) {
                taskList.removeChild(taskList.firstChild)
            }

            tasks.forEach((task) => {
                const li = document.createElement("LI")
                const textNode = document.createTextNode(task.render())
                li.appendChild(textNode)
                taskList?.appendChild(li)
            })

            const todoSet = document.querySelector("#todoSet")
            const reminderSet = document.querySelector("#reminderSet")

            if(mode == ViewMode.TODO) {
                todoSet?.setAttribute('style', 'display: block')
                todoSet?.removeAttribute('disabled')
                reminderSet?.setAttribute('style', 'display: none')
                reminderSet?.setAttribute('disabled', 'true')
            } else {
                reminderSet?.setAttribute('style', 'display: block')
                reminderSet?.removeAttribute('disabled')
                todoSet?.setAttribute('style', 'display: none')
                todoSet?.setAttribute('disabled', 'true')
            }
        }
    }

    const TaskController = (view : typeof TaskView) => {
        const tasks : Array<Task> = []
        let mode: ViewMode = ViewMode.TODO

        const handleEvent = (e: Event) => {
            e.preventDefault()
            let form = e.target as HTMLFormElement
            switch (mode as ViewMode) {
                case ViewMode.TODO:
                    tasks.push(view.getTodo(form));
                    break;
            
                case ViewMode.REMINDER:
                    tasks.push(view.getReminder(form));
                    break;
            }
            view.render(tasks, mode)
        }

        const handleToggleMode = () => {
            switch(mode as ViewMode) {
                case ViewMode.TODO:
                    mode = ViewMode.REMINDER
                    break
                case ViewMode.REMINDER:
                    mode = ViewMode.TODO
                    break
            }

            view.render(tasks, mode)
        }

        document.querySelector("#toggleMode")?.addEventListener("click", handleToggleMode)

        document.querySelector("#taskForm")?.addEventListener("submit", handleEvent)
    }

    TaskController(TaskView)
})()
```

## Contribuição

Contribuições são bem-vindas! Se você deseja contribuir com melhorias, correções de bugs ou novos recursos, siga as etapas descritas no arquivo README.
