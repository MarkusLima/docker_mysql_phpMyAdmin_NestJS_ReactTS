import { Role } from 'src/modules/roles/roles.model';
import { User } from 'src/modules/users/users.model';
import * as bcrypt from 'bcryptjs';
import { Route } from 'src/modules/routes/routes.model';
import { Permission } from 'src/modules/permissions/permissions.model';

export async function seedInitialData() {
  try {
    // Cria roles
    const [adminRole] = await Role.findOrCreate({ where: { name: 'admin' } });
    const [userRole] = await Role.findOrCreate({ where: { name: 'user' } });

    // Cria usuário admin
    const adminEmail = 'adm@adm.com';
    const adminExists = await User.findOne({ where: { email: adminEmail } });
    if (!adminExists) {
      await User.create({
        name: 'Administrador',
        email: adminEmail,
        password: await bcrypt.hash('admin123', 10),
        roleId: adminRole.id,
      });
      console.log('Usuário admin criado');
    } else {
      console.log('Usuário admin já existe');
    }

    // Garante permissões de admin para todas as rotas
    const routes = await Route.findAll();
    await Promise.all(
      routes.map(async (route) => {
        const exists = await Permission.findOne({ where: { routeId: route.id, roleId: adminRole.id } });
        if (!exists) {
          await Permission.create({ routeId: route.id, roleId: adminRole.id });
          console.log(`Permissão criada para rota ${route.url} (admin)`);
        }
      })
    );

    console.log('Seed finalizado com sucesso!');
  } catch (error) {
    console.error('Erro ao rodar seed:', error);
  }
}