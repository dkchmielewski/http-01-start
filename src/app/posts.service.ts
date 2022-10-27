import { Injectable } from "@angular/core";
import { HttpClient} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostsService {
    error = new Subject<string>();

    constructor(private http: HttpClient) {}

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content};
        this.http
        .post<{ name: string }>(
            'https://ng-complete-guide-13a4a-default-rtdb.firebaseio.com/posts.json', 
            postData
        )
        .subscribe(responseData => {
            console.log(responseData);
        }, error => {
            this.error.next(error.message);
        });
    }

    deletePosts() {
        return this.http.delete('https://ng-complete-guide-13a4a-default-rtdb.firebaseio.com/posts.json');
    }

    fetchPosts() {
        return this.http.get<{ [key: string]: Post }>('https://ng-complete-guide-13a4a-default-rtdb.firebaseio.com/posts.json')
        .pipe(
            map((responseData) => {
                const postsArray: Post[] = [];
                for(const key in responseData) {
                    if(responseData.hasOwnProperty(key)) {
                        postsArray.push({...responseData[key], id: key});
                    }
                }
            return postsArray;
            }),
            catchError(errorRes => {
                //send to analytics server
                return throwError(errorRes);
            })
        );
    }
}