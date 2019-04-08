/*
 * Copyright 2019 VMware, all rights reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';

import { GlobalAlertService } from './global-alert.service';

describe('GlobalAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalAlertService = TestBed.get(GlobalAlertService);
    expect(service).toBeTruthy();
  });
});
