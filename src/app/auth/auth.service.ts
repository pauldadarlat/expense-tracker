import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private firestore: AngularFirestore
  ) {}

  login(email: string, password: string): Observable<boolean> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap((userCredential) => {
        const user = userCredential.user;
        const userData: User = {
          id: user!.uid,
          pastExpenses: [], 
          spendingAmount: 0, 
        };

        this.userService.setUser(userData);
        return of(true);
      }),
      catchError(() => of(false))
    );
  }

  signup(email: string, password: string): Observable<boolean> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
      switchMap((userCredential) => {
        const user = userCredential.user;

        const userData: User = {
          id: user!.uid,
          pastExpenses: [],
          spendingAmount: 0,
        };

        return from(
          this.firestore.collection('users').doc(user!.uid).set({
            id: userData.id,
            pastExpenses: userData.pastExpenses,
            spendingAmount: userData.spendingAmount,
          })
        ).pipe(
          map(() => true),
          catchError(() => of(false))
        );
      }),
      catchError(() => of(false))
    );
  }

  isUserLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(map((user) => !!user));
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }
}
