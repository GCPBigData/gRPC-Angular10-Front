import { Component, OnInit } from '@angular/core';
import { grpc } from '@improbable-eng/grpc-web';
import {CountryService, CountryServiceCreate, CountryServiceDelete,
        CountryServiceGetAll, CountryServiceGetById, CountryServiceUpdate } from './generated/country_pb_service';
import {EmptyRequest, CountriesReply, CountryCreateRequest, CountrySearchRequest } from './generated/country_pb';
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

    const getCountryServiceGetAll  = new EmptyRequest();
    const getCountryServiceGetById = new EmptyRequest();
    const getCountryServiceCreate  = new EmptyRequest();
    const getCountryServiceUpdate  = new EmptyRequest();
    const getCountryServiceDelete  = new EmptyRequest();

    grpc.unary(CountryService.GetAll, {
      request: getCountryServiceGetAll,
     /* host: 'https://demogrpcweblinux.azurewebsites.net',*/
      host:'https://grpcwebdemo.azurewebsites.net',
      onEnd: res => {
        const { status, message} = res;
        if (status === grpc.Code.OK && message) {
        const result = message.toObject() as CountriesReply.AsObject;
        this.countries = result.countriesList.map(country =>
          ({
            id: country.id,
            name: country.name,
            description: country.description
          }) as CountryModel);
        }
      }
    });

    grpc.unary(CountryService.GetById, {
      request: getCountryServiceGetById,
      /*https://grpcwebdemo.azurewebsites.net (Windows App Service)*/
      host: 'https://demogrpcweblinux.azurewebsites.net',
      onEnd: res => {
        const { status, message} = res;
        if (status === grpc.Code.OK && message) {
          const result = message.toObject() as CountriesReply.AsObject;
          this.countries = result.countriesList.map(country =>
            ({
              id: country.id,
              name: country.name,
              description: country.description
            }) as CountryModel);
        }
      }
    });



  }
}
