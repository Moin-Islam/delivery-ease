import { types, flow } from 'mobx-state-tree';
import { Permissions } from './permissions';
import { baseUrl } from '../const/api';
// import fetchDetailsOk from '../components/utils/fetch-details-ok';
// import { auth } from '../firebase/firebase';

const StoreVanUser = types.model('StoreVanUser', {
  assign_store_id: types.maybeNull(types.number),
  assign_store_name: types.maybeNull(types.string),
  assign_van_id: types.maybeNull(types.number),
  assign_van_name: types.maybeNull(types.string),
  defautProfile: types.maybeNull(types.string),
  assign_van_number: types.maybeNull(types.string),
});

const UserInfo = types.model('UserInfo', {
  id: types.number,
  name: types.string,
  phone: types.string,
  email: types.maybeNull(types.string),
  status: types.number,
  created_at: types.string,
  updated_at: types.string,
  role: types.string,
  token: types.string,
  warehouse_id: types.maybeNull(types.number),
  store_id: types.maybeNull(types.number),
  store_name: types.maybeNull(types.string),
  permissions: types.array(Permissions),
  store_van_user: types.maybeNull(StoreVanUser)
});

export const User = types
  .model('User', {
    details: types.maybe(UserInfo),
  })
  .actions((self) => ({
          // firebaseCall: flow(function* firebaseFun(headers) {
          //   if (auth.currentUser) {
          //     return console.log(
          //       'user already signed in to firebase. UID: ',
          //       auth.currentUser.uid,
          //     );
          //   }
          //   const { firebase_token } = yield fetchDetailsOk(
          //     `${baseUrl}/get_firebase_token`,
          //     undefined,
          //     'GET',
          //     200,
          //     headers,
          //   );
          //   console.log(firebase_token)
          //   const fireUser = yield auth.signInWithCustomToken(
          //     firebase_token,
          //   );
          //   console.log('signed in to firebase. UID: ', fireUser?.user?.uid);
          //   return 0;
          // }),
    logIn(user) {
      self.details = user;
      const authToken = {
        Authorization: `Bearer ${user.token}`,
      }
      // self.firebaseCall(authToken)
    },
    logOut() {
      // self.details.store_van_user = undefined;
      self.details = undefined;
     
    },
    has_list_permission(subject) {
      const action = `${subject}_list`;
      var __FOUND = self?.details?.permissions.find(function (permission, index) {
      //  console.log(permission.name)
        if (permission.name == action) return true;
      });
     
      if (__FOUND == undefined) {
        return false;
      } else {
        return true;
      }
    },
    can(act, subject) {
      const action = `${subject}_${act}`;
      //console.log("checked crud gurd-" + action);
      var __FOUND = self.details.permissions.find(function (permission, index) {
        if (permission.name == action) return true;
      });
      if (__FOUND == undefined) {
        return false;
      } else {
        return true;
      }
    },
  
  }))
  .views((self) => ({
    get isLoggedIn() {
      return !!self.details;
    },
    get type() {
      if (!self.details) {
        return undefined;
      }
      return self.details.role;
    },
    get auth_token() {
      if (!self.details) {
        return undefined;
      }
      return self.details.token;
    },
    get name() {
      if (!self.details) {
        return undefined;
      }
      return self.details.name;
    },
    get store() {
      if (!self.details) {
        return undefined;
      }
      const store_details={id:self.details.store_id,name:self.details.store_name}
      return store_details;
    },
  }));
