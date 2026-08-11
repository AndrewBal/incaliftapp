import Home from '../pages/home.vue';
import Questions from '../pages/questions'
import Trips from '../pages/trips'
import Trip from '../pages/trip'
import Settings from '../pages/settings'
import Faults from '../pages/faults'
import Fault from '../pages/fault'
import Notifications from '../pages/notifications'
import Notification from '../pages/notification'
import Messages from '../pages/messages'
import Message from '../pages/message'
import AccidentReport from '../pages/accident-report'
import CheckList from '../pages/check-list'
import WorkLocation from '../pages/work-location'
import TaskDetails from '../pages/task-details'
import TaskChecklist from '../pages/task-checklist'
import TaskFinish from '../pages/task-finish'





import NotFoundPage from '../pages/404.vue';

var routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/questions/',
        name: 'questions',
        component: Questions
    },
    {
        path: '/check-list/',
        name: 'check-list',
        component: CheckList,

    },
    {
        path: '/work-location/',
        name: 'work-location',
        component: WorkLocation
    },
    {
        path: '/task-details/',
        name: 'task-details',
        component: TaskDetails
    },
    {
        path: '/task-checklist/',
        name: 'task-checklist',
        component: TaskChecklist
    },
    {
        path: '/task-finish/',
        name: 'task-finish',
        component: TaskFinish
    },
    {
        path: '/trips/',
        name: 'trips',
        component: Trips
    },
    {
        path: '/trip/',
        name: 'trip',
        component: Trip
    },
    {
        path: '/settings/',
        name: 'settings',
        component: Settings
    },
    {
        path: '/faults/',
        name: 'faults',
        component: Faults
    },
    {
        path: '/fault/',
        name: 'fault',
        component: Fault
    },
    {
        path: '/notifications/',
        name: 'notifications',
        component: Notifications
    },
    {
        path: '/notification/',
        name: 'notification',
        component: Notification
    },
    {
        path: '/messages/',
        name: 'messages',
        component: Messages
    },
    {
        path: '/message/',
        name: 'message',
        component: Message
    },
    {
        path: '/accident-report/',
        name: 'accident-report',
        component: AccidentReport
    },
    {
        path: '/download-report/',
        url: 'https://activation.smartostrich.quiktrak.eu/php/trip.php',
    },

    {
        path: '(.*)',
        component: NotFoundPage,
    },
];

export default routes;
