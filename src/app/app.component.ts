import { Component, OnInit } from '@angular/core';
import { grpc } from '@improbable-eng/grpc-web';
import { CountryService } from './generated/country_pb_service';
import { EmptyRequest, CountriesReply} from './generated/country_pb';
import { CountryModel } from './models/countryModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public title = 'gRPC';
  public countries: CountryModel[] = [];

  public ngOnInit() {

    const getCountryRequest = new EmptyRequest();

    grpc.unary(CountryService.GetAll, {
      request: getCountryRequest,
      /*https://grpcwebdemo.azurewebsites.net (Windows App Service)*/
      host: 'https://demogrpcweblinux.azurewebsites.net',
      onEnd: res => {
        const { status, statusMessage, headers, message, trailers } = res;
        if (status === grpc.Code.OK && message) {
        const result = message.toObject() as CountriesReply.AsObject;
        this.countries = result.countriesList.map(country =>
          ({
            name: country.name,
            description: country.description
          }) as CountryModel);
        }
      }
    });
  }
}
