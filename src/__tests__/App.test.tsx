/**
 * @author @electron-react-boilerplate
 * @type App Test
 * @fileoverview Render-checking for the LMCC App
 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/App';

describe('App', () => {
    it('should render', () => {
        expect(render(<App />)).toBeTruthy();
    });
});
