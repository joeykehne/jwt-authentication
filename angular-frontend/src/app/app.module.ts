import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatDialogModule,
} from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatDialogModule,
		HttpClientModule,
	],
	providers: [
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: { width: 'clamp(300px, 60%, 95%)' },
		},
		provideAnimationsAsync(),
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
