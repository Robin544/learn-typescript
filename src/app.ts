enum ProjectStatus { Active, Finished };

// Project class
class Project {
    constructor(
        public id: string,
        public title: string,
        public decription: string,
        public people: number,
        public status: ProjectStatus
    ) { }
}

type Listener = (projects: Project[]) => void;

// Project State Management class
class ProjectState {
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;

    // private constructor is used here to initialize the single instance for the entire application.
    private constructor() { }

    // Static method is used here to get the instance of the class.
    static getInstance() {
        if (this.instance) return this.instance;
        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listenerFn: Listener) {
        this.listeners.push(listenerFn);
    }

    addProject(title: string, description: string, prople: number) {
        const newProject = new Project(Math.random().toString(), title, description, prople, ProjectStatus.Active);
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}

const projectState = ProjectState.getInstance();

interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}


function validate(validatableInput: Validatable) {
    let isValid = true;

    if (validatableInput.required) {
        isValid = isValid && validatableInput.value?.toString()?.trim()?.length !== 0;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }

    return isValid;
}

// Auto bind 'this' keyword decorator
function autoBind(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }
    return adjDescriptor;
}

// ProjectList class
class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    sectionElement: HTMLElement;
    assignedProjects: Project[] = [];

    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.sectionElement = importedNode.firstElementChild as HTMLFormElement;
        this.sectionElement.id = `${this.type}-projects`;

        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter((project: Project) => {
                if (this.type === 'active') {
                    return project.status === ProjectStatus.Active;
                }
                return project.status === ProjectStatus.Finished;
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        })

        this.attach();
        this.renderContent();
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = '';
        for (const projectItem of this.assignedProjects) {
            const listItem = document.createElement('li');
            listItem.textContent = projectItem.title;
            listEl.appendChild(listItem);
        }
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.sectionElement);
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.sectionElement.querySelector('ul')!.id = listId;
        this.sectionElement.querySelector('header')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }
}

// ProjectInput class definition
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    formElement: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    decriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.formElement = importedNode.firstElementChild as HTMLFormElement;
        this.formElement.id = 'user-input';

        this.titleInputElement = this.formElement.querySelector('#title')! as HTMLInputElement;
        this.decriptionInputElement = this.formElement.querySelector('#description')! as HTMLInputElement;
        this.peopleInputElement = this.formElement.querySelector('#people')! as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.decriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    private gatherUserInputs(): [string, string, number] | void {
        const title = this.titleInputElement.value;
        const decription = this.decriptionInputElement.value;
        const people = this.peopleInputElement.value;

        const titleValidable: Validatable = {
            value: title,
            required: true
        }

        const descriptionValidable: Validatable = {
            value: decription,
            required: true,
            minLength: 5
        }

        const peopleValidable: Validatable = {
            value: people,
            required: true,
            min: 1,
            max: 5
        }

        if (!validate(titleValidable) || !validate(descriptionValidable) || !validate(peopleValidable)) {
            alert('Invalid input, please try again!');
            return;
        } else {
            return [title, decription, +people];
        }
    }

    @autoBind
    private handleSubmit(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInputs();
        if (Array.isArray(userInput)) {
            const [title, decription, people] = userInput;
            projectState.addProject(title, decription, people);
            this.clearInputs();
        }
    }

    private configure() {
        this.formElement.addEventListener('submit', this.handleSubmit);
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
    }
}

const pi = new ProjectInput();
const activePl = new ProjectList('active');
const finishedPl = new ProjectList('finished');