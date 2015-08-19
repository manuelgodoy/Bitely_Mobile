## Description of flow of screens:

1. Splash screen
 * Splash Screen.psd
 * Hay que agregarle un boton que diga Enter as Guest para que el usuario pueda entrar sin hacer login

2. Home
 * Places (or Restaurants) near you
 * Los cuadrados de los restaurantes pueden ser todos del mismo tamano
 * Cuando abres un restaurante de estos vas a Restaurant.psd (o Restaurant menu.png)

3. Restaurant Menu
 * Aqui un boton que falta es uno que agregue el plato a la orden en cada plato. Al ordenarse el plato aparecera el icon arriba del carrito con el monto. El icon del carrito con el monto te lleva a Check Out
 * Igualment debera aparecer un boton de enviar la orden al chef (Send to kitchen) en la parte de arriba del menu. Esta parte entiendo que sea dificil, pero es clave.
 * Al presionar el plato (no al boton de ordenar) iras a Individual Item.psd o Plate (single).png

4. Individual Item
 * Es una vista expandida de cada plato, es decir, foto mas grande, full descripcion, etc. Por ahora puede ser algo sencillo

5. Check out
 * El check out entrarias a Check.png
 * Si la orden por alguna razon no ha sido enviada el boton principal lee Send To Kitchen. Si si fue enviada el boton puede ser Pay

6. User Profile
 * El usuario tiene que ser capaz de ingresar su tarjeta de credito desde el side menu y lo llevaria a Edit Profile 1 y Edit Profile 2.

7. Redirections
 * Es importante recalcar que deberia existir la posibilidad de entrar a la aplicacion sin haber hecho el login con facebook (Vease 1). Cuando esto sucede hay que estar pendientes de las redirecciones:
  * El usuario puede agregar platos a la orden, pero a la hora de Send To Kitchen, el usuario tiene que hacer login. Si el usuarion ya tiene login pero no tiene tarjeta de credito registrada el usuario tiene que ser llevado a Edit Profile

  
