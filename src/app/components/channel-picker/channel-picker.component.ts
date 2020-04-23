import {Component, OnInit} from '@angular/core';
import {StreamstatService} from '../../streamstat.service';

@Component({
  selector: 'app-channel-picker',
  templateUrl: './channel-picker.component.html',
  styleUrls: ['./channel-picker.component.scss'],
})
export class ChannelPickerComponent implements OnInit {
  online: [];
  offline: [];
  isLoading = true;

  constructor(private stats: StreamstatService) {
  }

  ngOnInit() {
    this.stats.onlineChannels.subscribe((channels) => {
      this.online = channels.online as [];
      this.offline = channels.offline as [];
      this.isLoading = false;
    });
  }

}
