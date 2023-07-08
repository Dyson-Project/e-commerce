import {Subject} from 'rxjs';
import {StorageService} from './storage.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  isReady: boolean = false;

  constructor(private http: HttpClient, private storageService: StorageService) {
  }

  load() {
    this.isReady = true;
  }
}
