import { equal } from './assert';
import { hello } from '../src/index';

equal(hello('test'), 'Hello, test');
console.log('test passed');
